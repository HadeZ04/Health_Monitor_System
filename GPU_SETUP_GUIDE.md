# 🎮 Hướng Dẫn Chạy Qwen3 14B Trên GPU Server

## ✅ **Yêu Cầu Hệ Thống**

### Phần Cứng:
- **GPU:** NVIDIA GPU với CUDA support
- **VRAM:** 
  - 4-bit quantization: >= 10GB VRAM (RTX 3080, RTX 4070 Ti+)
  - 8-bit quantization: >= 16GB VRAM (RTX 4090, A5000, V100)
  - Full precision: >= 28GB VRAM (A100, H100)
- **RAM:** >= 16GB
- **Disk:** >= 50GB free space (để tải model)

### Phần Mềm:
- **OS:** Ubuntu 20.04+ / Windows 11 with WSL2
- **CUDA:** >= 11.8
- **cuDNN:** >= 8.6
- **Python:** 3.10 - 3.11
- **Driver:** Latest NVIDIA driver

---

## 📦 **Bước 1: Cài Đặt CUDA & Dependencies**

### Trên Ubuntu:
```bash
# Cài CUDA Toolkit
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda

# Kiểm tra CUDA
nvidia-smi
nvcc --version
```

### Trên Windows (WSL2):
```powershell
# Cài NVIDIA Driver cho Windows (host)
# Download từ: https://www.nvidia.com/Download/index.aspx

# Trong WSL2, CUDA sẽ tự động available
nvidia-smi
```

---

## 🐍 **Bước 2: Setup Python Environment**

```bash
cd Health_Monitor_System

# Tạo virtual environment
python3.10 -m venv venv_gpu
source venv_gpu/bin/activate  # Linux/Mac
# venv_gpu\Scripts\activate  # Windows

# Upgrade pip
pip install --upgrade pip

# Cài PyTorch với CUDA support
pip install torch==2.1.2 torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Kiểm tra CUDA trong PyTorch
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
python -c "import torch; print(f'GPU: {torch.cuda.get_device_name(0)}')"

# Cài các dependencies khác
pip install -r requirements_gpu.txt
```

---

## 🚀 **Bước 3: Chạy Qwen3 14B Server**

### Cách 1: 8-bit Quantization (KHUYẾN NGHỊ - 16GB VRAM)
```bash
python qwen_router_server.py --port 8081 --quantize 8bit
```

### Cách 2: 4-bit Quantization (10GB VRAM)
```bash
python qwen_router_server.py --port 8081 --quantize 4bit
```

### Cách 3: Full Precision (28GB+ VRAM)
```bash
python qwen_router_server.py --port 8081
```

### Chạy trên Remote GPU Server:
```bash
# Cho phép external access
python qwen3_router_server.py --host 0.0.0.0 --port 8081 --quantize 8bit
```

---

## 🧪 **Bước 4: Kiểm Tra Server**

### Test Health Endpoint:
```bash
# Local
curl http://localhost:8081/health | jq

# Remote
curl http://your-gpu-server-ip:8081/health | jq
```

**Expected Response:**
```json
{
  "status": "ok",
  "model": "Qwen/Qwen2.5-14B-Instruct",
  "mode": "model",
  "gpu": {
    "available": true,
    "device_name": "NVIDIA RTX 4090",
    "total_memory_gb": "24.00",
    "allocated_memory_gb": "15.23",
    "cached_memory_gb": "16.50"
  }
}
```

### Test Classification:
```bash
curl -X POST http://localhost:8081/classify \
  -H "Content-Type: application/json" \
  -d '{"input": "Tôi đau ngực dữ dội"}'
```

---

## ⚙️ **Bước 5: Cấu Hình Backend**

Sửa file `backend/.env`:
```env
# Nếu GPU server cùng máy với backend
QWEN_API_URL=http://localhost:8081

# Nếu GPU server ở máy khác
QWEN_API_URL=http://192.168.1.100:8081  # Thay bằng IP GPU server
```

---

## 🔥 **Hiệu Suất & Tối Ưu**

### So Sánh VRAM Usage:

| Quantization | VRAM Used | Latency | Quality |
|--------------|-----------|---------|---------|
| **4-bit**    | ~10GB     | 200ms   | 90%     |
| **8-bit**    | ~16GB     | 180ms   | 95%     |
| **FP16**     | ~28GB     | 150ms   | 100%    |

### Tips Tối Ưu:
1. **Batch Size = 1** (chatbot thường xử lý 1 request/lần)
2. **Temperature = 0.3** (ổn định hơn cho classification)
3. **max_new_tokens = 512** (đủ cho JSON response)

---

## 🐛 **Xử Lý Lỗi**

### Lỗi: CUDA Out of Memory
```bash
# Giảm xuống quantization thấp hơn
python qwen3_router_server.py --quantize 4bit

# Hoặc clear GPU cache
python -c "import torch; torch.cuda.empty_cache()"
```

### Lỗi: bitsandbytes not compiled with CUDA
```bash
# Reinstall bitsandbytes với CUDA
pip uninstall bitsandbytes
pip install bitsandbytes --no-cache-dir
```

### Lỗi: Model download timeout
```bash
# Set HuggingFace cache
export HF_HOME=/path/to/large/storage
export HF_HUB_CACHE=/path/to/large/storage

# Hoặc download trước
huggingface-cli download Qwen/Qwen2.5-14B-Instruct
```

---

## 📊 **Monitoring GPU**

### Xem GPU Usage real-time:
```bash
watch -n 0.5 nvidia-smi
```

### Xem trong Python:
```python
import torch

print(f"Allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
print(f"Cached: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB")
```

---

## 🚦 **Chạy Như Service (Production)**

### Systemd Service (Linux):
```bash
sudo nano /etc/systemd/system/qwen-router.service
```

```ini
[Unit]
Description=Qwen3 Router Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/Health_Monitor_System
Environment="PATH=/path/to/venv_gpu/bin"
ExecStart=/path/to/venv_gpu/bin/python qwen_router_server.py --port 8081 --quantize 8bit
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable qwen-router
sudo systemctl start qwen-router
sudo systemctl status qwen-router
```

---

## 🌐 **Chạy Từ Xa (Remote GPU Server)**

### Trên GPU Server:
```bash
# Mở port firewall
sudo ufw allow 8081

# Chạy server
python qwen_router_server.py --host 0.0.0.0 --port 8081 --quantize 8bit
```

### Trên Backend Server:
```env
# backend/.env
QWEN_API_URL=http://gpu-server-ip:8081
```

---

## 📈 **Benchmark**

Trên RTX 4090 (24GB VRAM):
- **Load time:** ~2-3 phút (lần đầu tải model)
- **Inference:** ~180ms/request
- **Throughput:** ~5 requests/second
- **VRAM usage:** ~16GB (8-bit)

---

**🎉 Xong! Giờ bạn có Qwen3 14B chạy trên GPU server rồi!**
