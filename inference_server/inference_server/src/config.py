from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Tuple

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        protected_namespaces=('settings_',),  # Cho phép fields bắt đầu bằng "model_"
    )

    hf_token: str | None = Field(default=None, alias="HF_TOKEN")
    model_id: str = Field(default="MidWin/Medfinetune", alias="MODEL_ID")
    model_revision: str | None = Field(default=None, alias="MODEL_REVISION")
    model_cache_dir: Path = Field(
        default=Path(".cache") / "models", alias="MODEL_CACHE_DIR"
    )

    rag_repo_id: str = Field(
        default="MidWin/pubmed-medcpt-faiss", alias="RAG_REPO_ID"
    )
    rag_dataset_archive: str = Field(
        default="pubmed_ds_embedded.tar.gz", alias="RAG_DATASET_ARCHIVE"
    )
    rag_dataset_dirname: str = Field(
        default="pubmed_ds_embedded", alias="RAG_DATASET_DIRNAME"
    )
    rag_index_file: str = Field(
        default="faiss_index.bin", alias="RAG_INDEX_FILE"
    )
    rag_cache_dir: Path = Field(
        default=Path(".cache") / "rag", alias="RAG_CACHE_DIR"
    )
    # Option to load dataset from local path (like your working code)
    rag_local_dataset_path: str | None = Field(
        default=None, alias="RAG_LOCAL_DATASET_PATH"
    )
    rag_local_index_path: str | None = Field(
        default=None, alias="RAG_LOCAL_INDEX_PATH"
    )
    medcpt_encoder_id: str = Field(
        default="ncbi/MedCPT-Query-Encoder", alias="MEDCPT_ENCODER_ID"
    )
    rag_top_k: int = Field(default=5, alias="RAG_TOP_K")
    rag_score_threshold: float = Field(
        default=0.5, alias="RAG_SCORE_THRESHOLD"  # Tăng ngưỡng để lọc bớt tài liệu không liên quan
    )
    max_context_chars: int = Field(default=4500, alias="MAX_CONTEXT_CHARS")
    history_embedding_model: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        alias="HISTORY_EMBEDDING_MODEL",
    )
    history_top_k: int = Field(default=3, alias="HISTORY_TOP_K")
    noise_keywords: Tuple[str, ...] = Field(
        default=(
            "covid", "sars-cov-2", "sars", "coronavirus", "pandemic", "vaccin",
            "hla-b", "hla-a", "hla-c", "genome", "genotype", "allele", "dna sequenc",
            "rna sequenc", "phylogenetic", "epidemiological study"
        ),
        alias="NOISE_KEYWORDS",
    )
    cautious_terms: Tuple[str, ...] = Field(
        default=(
            "ung thư",
            "ung thư gan",
            "hepatocellular carcinoma",
            "carcinoma",
            "sarcoma",
            "u ác",
            "khối u",
            "lymphoma",
        ),
        alias="CAUTIOUS_TERMS",
    )

    temperature: float = Field(default=0.0, alias="TEMPERATURE")
    repetition_penalty: float = Field(
        default=1.15, alias="REPETITION_PENALTY"
    )
    max_new_tokens: int = Field(default=1024, alias="MAX_NEW_TOKENS")
    gpu_memory_utilization: float = Field(
        default=0.7, alias="GPU_MEMORY_UTILIZATION"  # Match working test code
    )
    tensor_parallel_size: int = Field(
        default=1, alias="TENSOR_PARALLEL_SIZE"
    )
    dtype: str = Field(default="half", alias="DTYPE")
    enable_safety_guard: bool = Field(
        default=True, alias="ENABLE_SAFETY_GUARD"
    )

    server_host: str = Field(default="0.0.0.0", alias="SERVER_HOST")
    server_port: int = Field(default=8080, alias="SERVER_PORT")
    log_level: str = Field(default="info", alias="LOG_LEVEL")

    def ensure_cache_dirs(self) -> None:
        self.model_cache_dir.mkdir(parents=True, exist_ok=True)
        self.rag_cache_dir.mkdir(parents=True, exist_ok=True)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()
    settings.ensure_cache_dirs()
    return settings

