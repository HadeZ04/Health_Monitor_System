from __future__ import annotations

import logging
import tarfile
from pathlib import Path
from typing import Dict, List

import faiss
import numpy as np
import torch
from datasets import load_from_disk
from huggingface_hub import hf_hub_download, snapshot_download
from transformers import AutoModel, AutoTokenizer

from .config import Settings, get_settings

logger = logging.getLogger(__name__)


class PubMedRetriever:
    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()
        self.cache_dir = Path(self.settings.rag_cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

        self.pubmed_ds = None
        self.index = None
        self.available = False
        # Cache files đã mở ở class level để tái sử dụng giữa các lần retrieve
        self._file_cache = {}  # arrow_file -> table
        self._max_cache_size = 10  # Giới hạn số files trong cache để tránh tốn RAM

        try:
            dataset_path = self._ensure_dataset()
            logger.info(f"Đang load dataset từ: {dataset_path}")
            # Load dataset với ignore_metadata để tránh lỗi format cũ
            try:
                logger.debug("Thử load dataset với load_from_disk()...")
                self.pubmed_ds = load_from_disk(str(dataset_path))
                logger.info(f"Dataset đã load thành công: {self.pubmed_ds.num_rows} rows")
            except Exception as load_exc:
                # Nếu load thất bại do metadata, thử load từ arrow files trực tiếp
                # Đây là expected behavior khi metadata format không tương thích
                logger.debug("Load với metadata thất bại (expected), chuyển sang lazy loading từ arrow files: %s", load_exc)
                from datasets import Dataset
                import pyarrow as pa
                arrow_files = sorted(list(Path(dataset_path).glob("data-*.arrow")))
                if arrow_files:
                    # Tối ưu: Load dataset với memory mapping (mmap) để không tốn RAM
                    # Chỉ load metadata và mapping, data sẽ được đọc từ disk khi cần
                    logger.info("Đang load dataset với memory mapping (lazy loading)...")
                    from datasets import Dataset
                    import pyarrow as pa
                    
                    # Tạo mapping index -> file để truy cập nhanh
                    self._index_to_file = {}
                    self._file_row_counts = {}
                    current_idx = 0
                    
                    for arrow_file in sorted(arrow_files):
                        try:
                            # Đọc metadata để biết số rows
                            # Sử dụng open_file() thay vì open_stream() cho RecordBatchFile format
                            mmap = pa.memory_map(str(arrow_file))
                            try:
                                # Thử open_file() trước (cho RecordBatchFile format)
                                reader = pa.ipc.open_file(mmap)
                                table = reader.read_all()
                            except (pa.lib.ArrowInvalid, ValueError, TypeError):
                                # Nếu không được, thử open_stream() (cho stream format)
                                mmap.close()
                                mmap = pa.memory_map(str(arrow_file))
                                reader = pa.ipc.open_stream(mmap)
                                table = reader.read_all()
                            mmap.close()
                            
                            num_rows = len(table)
                            self._index_to_file[current_idx] = (arrow_file, current_idx)
                            self._file_row_counts[arrow_file] = num_rows
                            current_idx += num_rows
                            logger.debug(f"Đã load metadata từ {arrow_file.name}: {num_rows} rows")
                        except Exception as e:
                            logger.warning(f"Không thể đọc metadata từ {arrow_file}: {e}", exc_info=True)
                            continue
                    
                    self._dataset_path = dataset_path
                    self._arrow_files = sorted(arrow_files)
                    self._total_rows = current_idx
                    self._lazy_dataset = True
                    logger.info(f"Dataset mapping đã sẵn sàng: {self._total_rows} rows từ {len(arrow_files)} files")
                else:
                    raise load_exc
            
            logger.info("Đang load FAISS index...")
            self.index = self._ensure_faiss()
            logger.info(f"FAISS index đã load: {self.index.ntotal} vectors")
            self.available = True
            if hasattr(self, '_lazy_dataset') and self._lazy_dataset:
                logger.info(
                    "Loaded PubMed dataset mapping (%s rows) & FAISS index (lazy loading).",
                    self._total_rows,
                )
            else:
                logger.info(
                    "Loaded PubMed dataset (%s rows) & FAISS index.",
                    self.pubmed_ds.num_rows if self.pubmed_ds else 0,
                )
        except Exception as exc:
            logger.warning("RAG assets unavailable: %s", exc)

        device_str = "cuda" if torch.cuda.is_available() else "cpu"
        self.device = torch.device(device_str)
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.settings.medcpt_encoder_id
        )
        self.encoder = AutoModel.from_pretrained(
            self.settings.medcpt_encoder_id
        ).to(self.device)
        self.encoder.eval()

    def _ensure_dataset(self) -> Path:
        dataset_dir = self.cache_dir / self.settings.rag_dataset_dirname
        if dataset_dir.exists():
            return dataset_dir

        logger.info("Downloading dataset folder from Hugging Face…")
        
        # Download toàn bộ folder pubmed_ds_embedded từ repo
        snapshot_download(
            repo_id=self.settings.rag_repo_id,
            repo_type="dataset",
            token=self.settings.hf_token,
            local_dir=str(self.cache_dir),
            allow_patterns=f"{self.settings.rag_dataset_dirname}/**",  # Chỉ download folder pubmed_ds_embedded
        )
        
        # Kiểm tra xem folder đã được download chưa
        if not dataset_dir.exists():
            raise FileNotFoundError(
                f"Dataset folder {self.settings.rag_dataset_dirname} not found after download"
            )
        
        return dataset_dir

    def _ensure_faiss(self) -> faiss.Index:
        index_path = self.cache_dir / self.settings.rag_index_file
        if not index_path.exists():
            logger.info("Downloading FAISS index…")
            hf_hub_download(
                repo_id=self.settings.rag_repo_id,
                filename=self.settings.rag_index_file,
                repo_type="dataset",
                token=self.settings.hf_token,
                local_dir=str(self.cache_dir),
            )
        return faiss.read_index(str(index_path))

    def encode_query(self, query: str) -> np.ndarray:
        inputs = self.tokenizer(
            query,
            padding=True,
            truncation=True,
            max_length=64,
            return_tensors="pt",
        ).to(self.device)
        with torch.no_grad():
            outputs = self.encoder(**inputs)
            cls_emb = outputs.last_hidden_state[:, 0, :]
        vec = cls_emb[0].cpu().numpy().astype("float32")
        faiss.normalize_L2(vec.reshape(1, -1))
        return vec

    def _get_doc_by_index(self, idx: int) -> Dict | None:
        """Lấy document theo index, sử dụng lazy loading với memory mapping."""
        if hasattr(self, '_lazy_dataset') and self._lazy_dataset:
            # Tìm file chứa index này
            import pyarrow as pa
            current_idx = 0
            for arrow_file in self._arrow_files:
                num_rows = self._file_row_counts.get(arrow_file, 0)
                if idx < current_idx + num_rows:
                    # Index nằm trong file này
                    local_idx = idx - current_idx
                    try:
                        # Kiểm tra cache trước
                        if hasattr(self, '_file_cache') and arrow_file in self._file_cache:
                            table = self._file_cache[arrow_file]
                        else:
                            # Đọc file với memory mapping (không load toàn bộ vào RAM)
                            mmap = pa.memory_map(str(arrow_file))
                            try:
                                # Thử open_file() trước (cho RecordBatchFile format)
                                reader = pa.ipc.open_file(mmap)
                                table = reader.read_all()
                            except (pa.lib.ArrowInvalid, ValueError, TypeError):
                                # Nếu không được, thử open_stream() (cho stream format)
                                mmap.close()
                                mmap = pa.memory_map(str(arrow_file))
                                reader = pa.ipc.open_stream(mmap)
                                table = reader.read_all()
                            mmap.close()
                            # Lưu vào cache
                            if hasattr(self, '_file_cache'):
                                if len(self._file_cache) >= self._max_cache_size:
                                    oldest_file = next(iter(self._file_cache))
                                    del self._file_cache[oldest_file]
                                self._file_cache[arrow_file] = table
                        
                        if local_idx < len(table):
                            # Lấy row từ table bằng slice
                            row_slice = table.slice(local_idx, 1)
                            # Lấy giá trị từ các columns
                            title_val = row_slice["title"][0]
                            abstract_val = row_slice["abstract"][0]
                            pmid_val = row_slice["PMID"][0]
                            
                            # Convert sang Python types
                            if hasattr(title_val, "as_py"):
                                title = title_val.as_py()
                            else:
                                title = str(title_val)
                            
                            if hasattr(abstract_val, "as_py"):
                                abstract = abstract_val.as_py()
                            else:
                                abstract = str(abstract_val)
                            
                            if hasattr(pmid_val, "as_py"):
                                pmid = pmid_val.as_py()
                            else:
                                pmid = int(pmid_val)
                            
                            # Xử lý nếu title/abstract là list
                            if isinstance(title, list):
                                title = " ".join(str(x) for x in title) if title else ""
                            if isinstance(abstract, list):
                                abstract = " ".join(str(x) for x in abstract) if abstract else ""
                            
                            return {
                                "title": title,
                                "abstract": abstract,
                                "PMID": pmid,
                            }
                    except Exception as e:
                        logger.warning(f"Lỗi khi đọc file {arrow_file}: {e}", exc_info=True)
                        return None
                current_idx += num_rows
            return None
        else:
            # Dataset đã load vào memory
            if idx < 0 or (self.pubmed_ds is not None and idx >= len(self.pubmed_ds)):
                return None
            row = self.pubmed_ds[int(idx)]
            return {
                "title": row.get("title", ""),
                "abstract": row.get("abstract", ""),
                "PMID": row.get("PMID", ""),
            }

    def retrieve(self, question: str, top_k: int) -> List[Dict]:
        if not self.available or self.index is None:
            return []

        query_vec = self.encode_query(question).reshape(1, -1)
        distances, indices = self.index.search(query_vec, top_k)
        docs: List[Dict] = []
        
        # Sử dụng class-level cache, chỉ cache trong scope này nếu cần
        cached_files = self._file_cache.copy() if hasattr(self, '_file_cache') else {}
        
        for rank, (idx, score) in enumerate(zip(indices[0], distances[0]), 1):
            if idx < 0:
                continue
            
            if hasattr(self, '_lazy_dataset') and self._lazy_dataset:
                # Lazy loading: tìm file và đọc
                current_idx = 0
                found = False
                for arrow_file in self._arrow_files:
                    num_rows = self._file_row_counts.get(arrow_file, 0)
                    if idx < current_idx + num_rows:
                        local_idx = idx - current_idx
                        # Cache file đã mở
                        if arrow_file not in cached_files:
                            try:
                                import pyarrow as pa
                                mmap = pa.memory_map(str(arrow_file))
                                try:
                                    # Thử open_file() trước (cho RecordBatchFile format)
                                    reader = pa.ipc.open_file(mmap)
                                    table = reader.read_all()
                                except (pa.lib.ArrowInvalid, ValueError, TypeError):
                                    # Nếu không được, thử open_stream() (cho stream format)
                                    mmap.close()
                                    mmap = pa.memory_map(str(arrow_file))
                                    reader = pa.ipc.open_stream(mmap)
                                    table = reader.read_all()
                                mmap.close()
                                cached_files[arrow_file] = table
                                # Cập nhật class-level cache (với giới hạn size)
                                if hasattr(self, '_file_cache'):
                                    if len(self._file_cache) >= self._max_cache_size:
                                        # Xóa file cũ nhất (FIFO)
                                        oldest_file = next(iter(self._file_cache))
                                        del self._file_cache[oldest_file]
                                    self._file_cache[arrow_file] = table
                            except Exception as e:
                                logger.warning(f"Lỗi khi đọc file {arrow_file}: {e}", exc_info=True)
                                break
                        
                        table = cached_files[arrow_file]
                        if local_idx < len(table):
                            # Lấy row từ table bằng slice
                            row_slice = table.slice(local_idx, 1)
                            # Lấy giá trị từ các columns
                            title_val = row_slice["title"][0]
                            abstract_val = row_slice["abstract"][0]
                            pmid_val = row_slice["PMID"][0]
                            
                            # Convert sang Python types
                            if hasattr(title_val, "as_py"):
                                title = title_val.as_py()
                            else:
                                title = str(title_val)
                            
                            if hasattr(abstract_val, "as_py"):
                                abstract = abstract_val.as_py()
                            else:
                                abstract = str(abstract_val)
                            
                            if hasattr(pmid_val, "as_py"):
                                pmid = pmid_val.as_py()
                            else:
                                pmid = int(pmid_val)
                            
                            # Xử lý nếu title/abstract là list
                            if isinstance(title, list):
                                title = " ".join(str(x) for x in title) if title else ""
                            if isinstance(abstract, list):
                                abstract = " ".join(str(x) for x in abstract) if abstract else ""
                            
                            docs.append({
                                "title": title,
                                "abstract": abstract,
                                "pmid": str(pmid) if pmid else "",
                                "score": float(score),
                                "rank": rank,
                            })
                            found = True
                        break
                    current_idx += num_rows
                if not found:
                    continue
            else:
                # Dataset đã load vào memory
                if idx < 0 or (self.pubmed_ds is not None and idx >= len(self.pubmed_ds)):
                    continue
                row = self.pubmed_ds[int(idx)]
                docs.append({
                    "title": row.get("title", ""),
                    "abstract": row.get("abstract", ""),
                    "pmid": row.get("PMID", ""),
                    "score": float(score),
                    "rank": rank,
                })
        
        return docs

