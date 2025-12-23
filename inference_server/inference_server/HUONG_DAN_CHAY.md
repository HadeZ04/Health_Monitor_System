# Hướng Dẫn Chạy Inference Server

## Tải Folder (Không Tải Cache)

Nếu bạn muốn tải folder này từ server khác mà không tải cache (tiết kiệm băng thông):

```bash
# Sử dụng script có sẵn
./download_without_cache.sh user@server:/path/to/inference_server

# Hoặc xem file HUONG_DAN_TAI.md để biết thêm các cách khác
```

**Lưu ý:** Cache (`.cache/`) rất lớn (~20GB+), không cần tải vì sẽ tự động tải từ Hugging Face khi chạy.

## Bước 1: Cài đặt môi trường Python

```bash
# Tạo virtual environment
apt install python3.10-venv
python -m venv .venv

# Kích hoạt virtual environment
source .venv/bin/activate  # Linux/Mac
# hoặc
.venv\Scripts\activate  # Windows
```

## Bước 2: Cài đặt dependencies

```bash
# Nâng cấp pip
pip install --upgrade pip

# Cài đặt các package cần thiết
pip install -r requirements.txt
```

## Bước 3: Cấu hình môi trường

```bash
# Copy file mẫu cấu hình
cp env.sample .env

# Chỉnh sửa file .env với thông tin của bạn
# Đặc biệt là HF_TOKEN (Hugging Face token)
```

**Lưu ý:** Bạn cần có:
- `HF_TOKEN`: Token từ Hugging Face để tải model và dataset
- `MODEL_ID`: ID của model trên Hugging Face (mặc định: `MidWin/Medfinetune`)
- Các cấu hình khác có thể giữ nguyên hoặc điều chỉnh theo nhu cầu

## Bước 4: Chạy server

```bash
# Chạy server
python -m src.api
```

Server sẽ chạy tại: `http://0.0.0.0:8080` (hoặc port bạn đã cấu hình)

## Bước 5: Kiểm tra server

Mở trình duyệt hoặc dùng curl:

```bash
# Kiểm tra health
curl http://localhost:8080/health

# Xem API documentation
# Mở trình duyệt: http://localhost:8080/docs
```

## Sử dụng API

### Gửi câu hỏi y tế:

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?",
    "session_id": "patient-123",
    "max_new_tokens": 512,
    "top_k": 5
  }'
```

## Chạy bằng Docker (Tùy chọn)

Nếu bạn muốn chạy bằng Docker:

```bash
# Build image
docker build -t med-llava-server .

# Chạy container
docker run --gpus all --env-file .env -p 8080:8080 med-llava-server
```

**Lưu ý:** Cần có NVIDIA Container Toolkit để sử dụng GPU.

## Yêu cầu hệ thống

- Python 3.8+
- GPU với ít nhất 24GB VRAM (khuyến nghị: A10G, L40S, A100)
- CUDA toolkit (nếu chạy trên GPU)
- Kết nối internet để tải model và dataset từ Hugging Face

## Kiểm tra RAG (Retrieval-Augmented Generation)

RAG cho phép hệ thống tìm kiếm thông tin từ PubMed để trả lời câu hỏi y tế chính xác hơn.

### Kiểm tra RAG có hoạt động:

```bash
# Kiểm tra health endpoint
curl http://localhost:8080/health

# Nếu status là "ok" thì RAG đã sẵn sàng
# Nếu status là "degraded" thì RAG chưa hoạt động
```

### Nếu RAG chưa hoạt động:

1. **Kiểm tra FAISS index:**
   ```bash
   ls -lh .cache/rag/faiss_index.bin
   ```

2. **Nếu thiếu, tải FAISS index:**
   ```bash
   source .venv/bin/activate
   python3 -c "
   from src.config import get_settings
   from huggingface_hub import hf_hub_download
   from pathlib import Path
   
   settings = get_settings()
   index_path = Path(settings.rag_cache_dir) / settings.rag_index_file
   
   if not index_path.exists():
       print('Đang tải FAISS index...')
       hf_hub_download(
           repo_id=settings.rag_repo_id,
           filename=settings.rag_index_file,
           repo_type='dataset',
           token=settings.hf_token,
           local_dir=str(settings.rag_cache_dir),
       )
       print('✓ Đã tải FAISS index thành công')
   else:
       print('✓ FAISS index đã tồn tại')
   "
   ```

3. **Restart server** để RAG hoạt động:
   ```bash
   # Dừng server (Ctrl+C) và chạy lại
   python -m src.api
   ```

## Xử lý lỗi thường gặp

1. **Lỗi thiếu GPU**: Nếu không có GPU, có thể cần điều chỉnh cấu hình để chạy trên CPU (không khuyến nghị)
2. **Lỗi thiếu token**: Đảm bảo file `.env` có `HF_TOKEN` hợp lệ
3. **Lỗi thiếu model**: Kiểm tra `MODEL_ID` trong `.env` có đúng không
4. **RAG không hoạt động**: Kiểm tra xem có thông báo "RAG assets unavailable" trong log không. Nếu có, cần tải FAISS index (xem phần trên)

