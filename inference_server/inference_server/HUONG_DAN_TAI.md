# Hướng Dẫn Tải Folder Inference Server (Không Tải Cache)

## Cách 1: Sử dụng Git (Khuyến nghị)

Nếu project có Git repository:

```bash
# Clone repository
git clone <repository-url> inference_server
cd inference_server

# Xóa cache nếu đã có
rm -rf .cache/ .venv/ __pycache__/
```

## Cách 2: Sử dụng rsync (Loại trừ cache)

```bash
# Tải folder từ server khác, loại trừ cache
rsync -av --exclude='.cache' \
          --exclude='.venv' \
          --exclude='__pycache__' \
          --exclude='*.pyc' \
          --exclude='.env' \
          user@server:/path/to/inference_server/ ./inference_server/
```

## Cách 3: Sử dụng tar với exclude

```bash
# Trên server nguồn, tạo archive không có cache
tar --exclude='.cache' \
    --exclude='.venv' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.env' \
    -czf inference_server.tar.gz inference_server/

# Tải file tar về
# Sau đó giải nén
tar -xzf inference_server.tar.gz
```

## Cách 4: Sử dụng scp với exclude (phức tạp hơn)

```bash
# Tạo file danh sách exclude
cat > exclude_list.txt << EOF
.cache
.venv
__pycache__
*.pyc
.env
EOF

# Sử dụng rsync với file exclude
rsync -av --exclude-from=exclude_list.txt \
          user@server:/path/to/inference_server/ ./inference_server/
```

## Cách 5: Tải từng file/folder cụ thể

```bash
# Chỉ tải các file/folder cần thiết
scp -r user@server:/path/to/inference_server/src ./inference_server/
scp user@server:/path/to/inference_server/requirements.txt ./inference_server/
scp user@server:/path/to/inference_server/Dockerfile ./inference_server/
scp user@server:/path/to/inference_server/README.md ./inference_server/
scp user@server:/path/to/inference_server/env.sample ./inference_server/
# ... các file khác
```

## Các thư mục/file nên loại trừ:

- `.cache/` - Cache của models và datasets (rất lớn, ~18GB+)
- `.venv/` hoặc `venv/` - Virtual environment (có thể tạo lại)
- `__pycache__/` - Python bytecode cache
- `*.pyc`, `*.pyo` - Compiled Python files
- `.env` - Environment variables (có thể tạo từ env.sample)

## Sau khi tải về:

1. **Tạo virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. **Cài đặt dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Tạo file .env:**
   ```bash
   cp env.sample .env
   # Chỉnh sửa .env với thông tin của bạn
   ```

4. **Models và datasets sẽ tự động tải khi chạy:**
   - Model sẽ được tải vào `.cache/models/` khi server khởi động
   - Dataset RAG sẽ được tải vào `.cache/rag/` khi server khởi động

## Lưu ý:

- **Cache rất lớn**: `.cache/` có thể lên đến 20-30GB (models + datasets)
- **Không cần tải cache**: Models và datasets sẽ tự động tải từ Hugging Face khi cần
- **Tốc độ tải**: Tải code (~10-50MB) nhanh hơn nhiều so với tải cache (~20GB)
- **Bandwidth**: Tiết kiệm băng thông đáng kể khi không tải cache

## Kiểm tra kích thước:

```bash
# Xem kích thước các thư mục
du -sh .cache/ .venv/ __pycache__/ 2>/dev/null

# Xem kích thước toàn bộ folder (không tính cache)
du -sh --exclude='.cache' --exclude='.venv' --exclude='__pycache__' .
```

