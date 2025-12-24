# 🚀 Quick Start - Chạy Qwen3 14B Trên GPU

## ⚡ Tóm Tắt Nhanh

### Yêu Cầu Tối Thiểu:
- **GPU:** NVIDIA với >= 16GB VRAM (RTX 4090, A5000, V100...)
- **CUDA:** >= 11.8
- **Python:** 3.10 hoặc 3.11

---

## 📝 Các Bước (5 Phút)

### 1️⃣ Cài Dependencies
```bash
cd Health_Monitor_System

# Cài PyTorch với CUDA
pip install torch==2.1.2 torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Cài các packages khác
pip install -r requirements_gpu.txt
```

### 2️⃣ Kiểm Tra GPU
```bash
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"
python -c "import torch; print(f'GPU: {torch.cuda.get_device_name(0)}')"
```

**Expected Output:**
```
CUDA: True
GPU: NVIDIA GeForce RTX 4090
```

### 3️⃣ Chạy Server
```bash
# 8-bit quantization (KHUYẾN NGHỊ - 16GB VRAM)
python qwen_router_server.py --port 8081 --quantize 8bit
```

**Chờ đến khi thấy:**
```
✓ Model loaded successfully!
🌐 Server: http://0.0.0.0:8081
🤖 Mode: MODEL
```

### 4️⃣ Test (Terminal Mới)
```bash
curl http://localhost:8081/health | python -m json.tool
```

**Expected Response:**
```json
{
  "status": "ok",
  "model": "Qwen/Qwen2.5-14B-Instruct",
  "mode": "model",
  "gpu": {
    "available": true,
    "device_name": "NVIDIA GeForce RTX 4090",
    "total_memory_gb": "24.00"
  }
}
```

### 5️⃣ Chạy Backend
```bash
# Terminal mới
cd backend
npm run dev
```

---

## 🎮 Chế Độ Quantization

| Lệnh | VRAM | Tốc Độ | Chất Lượng |
|------|------|--------|------------|
| `--quantize 4bit` | 10GB | Nhanh | Tốt (90%) |
| `--quantize 8bit` | 16GB | Trung bình | Rất tốt (95%) |
| Không flag | 28GB+ | Chậm | Xuất sắc (100%) |

---

## 🔧 Troubleshooting

### ❌ "CUDA out of memory"
```bash
# Giảm xuống 4-bit
python qwen_router_server.py --port 8081 --quantize 4bit
```

### ❌ "torch.cuda.is_available() = False"
```bash
# Kiểm tra NVIDIA driver
nvidia-smi

# Reinstall PyTorch với CUDA
pip uninstall torch
pip install torch==2.1.2 --index-url https://download.pytorch.org/whl/cu118
```

### ❌ Model download chậm
```bash
# Set mirror (China)
export HF_ENDPOINT=https://hf-mirror.com

# Hoặc download trước
huggingface-cli download Qwen/Qwen2.5-14B-Instruct
```

---

## 🌐 Chạy Remote GPU Server

### Trên GPU Server:
```bash
python qwen_router_server.py --host 0.0.0.0 --port 8081 --quantize 8bit
```

### Trên Backend Server:
```env
# backend/.env
QWEN_API_URL=http://192.168.1.100:8081  # Thay IP
```

---

## 📊 Performance Benchmark

**RTX 4090 + 8-bit Quantization:**
- Load time: ~2 phút (lần đầu)
- Inference: ~180ms/request
- VRAM: ~16GB

**A100 + Full Precision:**
- Load time: ~3 phút
- Inference: ~150ms/request
- VRAM: ~28GB

---

## ✅ Hoàn Thành!

Giờ bạn có:
- ✅ Qwen3 14B chạy trên GPU
- ✅ Backend kết nối với Qwen
- ✅ Phân loại intent thông minh (không còn mock)

**Xem thêm:** [GPU_SETUP_GUIDE.md](GPU_SETUP_GUIDE.md) cho hướng dẫn chi tiết
