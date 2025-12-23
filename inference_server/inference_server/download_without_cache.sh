#!/bin/bash
# Script để tải inference_server folder mà không tải cache

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Tải Inference Server (Không Tải Cache) ===${NC}"
echo ""

# Kiểm tra tham số
if [ -z "$1" ]; then
    echo -e "${YELLOW}Cách sử dụng:${NC}"
    echo ""
    echo -e "${BLUE}1. Tạo archive trên server (chạy trên Linux server):${NC}"
    echo "   $0 create-archive [output_file.tar.gz]"
    echo ""
    echo -e "${BLUE}2. Tải từ server về local (chạy trên máy local):${NC}"
    echo "   $0 download user@server:/path/to/inference_server [local_dest]"
    echo ""
    echo -e "${BLUE}3. Copy local (chạy trên Linux server):${NC}"
    echo "   $0 copy /path/to/source [destination]"
    echo ""
    echo -e "${YELLOW}Ví dụ tải về Windows:${NC}"
    echo "   # Trên Linux server:"
    echo "   $0 create-archive"
    echo "   # Sau đó dùng scp/winscp để tải inference_server.tar.gz về Windows"
    echo ""
    exit 1
fi

MODE="$1"

# Tạo file exclude list
EXCLUDE_FILE=$(mktemp)
cat > "$EXCLUDE_FILE" << EOF
.cache
.venv
venv
__pycache__
*.pyc
*.pyo
*.py[cod]
.env
*.log
.DS_Store
Thumbs.db
EOF

if [ "$MODE" = "create-archive" ]; then
    # Tạo archive
    OUTPUT="${2:-inference_server.tar.gz}"
    CURRENT_DIR=$(pwd)
    PARENT_DIR=$(dirname "$CURRENT_DIR")
    FOLDER_NAME=$(basename "$CURRENT_DIR")
    
    # Đảm bảo output file không nằm trong thư mục đang archive
    if [[ "$OUTPUT" != /* ]]; then
        OUTPUT="$PARENT_DIR/$OUTPUT"
    fi
    
    echo -e "${GREEN}Đang tạo archive...${NC}"
    echo -e "${YELLOW}Loại trừ:${NC} .cache, .venv, __pycache__, .env, *.pyc"
    echo ""
    
    # Tạo archive ở thư mục cha
    cd "$PARENT_DIR" || exit 1
    
    tar --exclude-from="$EXCLUDE_FILE" \
        --exclude="$OUTPUT" \
        -czf "$OUTPUT" \
        "$FOLDER_NAME"
    
    cd "$CURRENT_DIR" || exit 1
    
    if [ -f "$OUTPUT" ]; then
        FILE_SIZE=$(du -h "$OUTPUT" | cut -f1)
        OUTPUT_DISPLAY=$(basename "$OUTPUT")
    else
        FILE_SIZE="N/A"
        OUTPUT_DISPLAY="$OUTPUT"
    fi
    echo ""
    echo -e "${GREEN}✓ Hoàn thành!${NC}"
    echo -e "${YELLOW}File:${NC} $OUTPUT (Kích thước: $FILE_SIZE)"
    echo -e "${YELLOW}Đường dẫn đầy đủ:${NC} $OUTPUT"
    echo ""
    echo -e "${BLUE}Để tải về Windows:${NC}"
    echo "  1. Dùng WinSCP: Kéo thả file $OUTPUT_DISPLAY vào Windows"
    echo "  2. Dùng scp từ Windows (PowerShell):"
    echo "     scp root@MedGPU:$OUTPUT C:\\Users\\ACER\\Downloads\\"
    echo "  3. Dùng scp từ Windows (WSL):"
    echo "     scp root@MedGPU:$OUTPUT /mnt/c/Users/ACER/Downloads/"
    echo ""
    echo -e "${BLUE}Sau khi tải về Windows, giải nén:${NC}"
    echo "  # Trong WSL hoặc Git Bash:"
    echo "  tar -xzf $OUTPUT_DISPLAY"
    echo "  # Hoặc dùng 7-Zip/WinRAR trên Windows để giải nén"
    
elif [ "$MODE" = "download" ]; then
    # Tải từ remote
    if [ -z "$2" ]; then
        echo -e "${RED}Lỗi: Cần chỉ định source path${NC}"
        echo "Ví dụ: $0 download user@server:/path/to/inference_server"
        exit 1
    fi
    
    SOURCE="$2"
    DEST="${3:-./inference_server}"
    
    # Kiểm tra nếu đích là Windows path (chạy từ Windows)
    if [[ "$DEST" == *"\\"* ]] || [[ "$DEST" == *"C:"* ]] || [[ "$DEST" == *"D:"* ]]; then
        echo -e "${RED}Lỗi: Không thể dùng Windows path trực tiếp từ Linux server${NC}"
        echo ""
        echo -e "${YELLOW}Giải pháp:${NC}"
        echo "  1. Chạy script này từ máy Windows (WSL hoặc Git Bash)"
        echo "  2. Hoặc tạo archive trên server rồi tải về:"
        echo "     $0 create-archive"
        exit 1
    fi
    
    echo -e "${YELLOW}Nguồn:${NC} $SOURCE"
    echo -e "${YELLOW}Đích:${NC} $DEST"
    echo ""
    
    echo -e "${GREEN}Đang tải...${NC}"
    echo "Loại trừ: .cache, .venv, __pycache__, .env, *.pyc"
    
    rsync -av --progress \
        --exclude-from="$EXCLUDE_FILE" \
        "$SOURCE/" "$DEST/"
    
    echo ""
    echo -e "${GREEN}✓ Hoàn thành!${NC}"
    
elif [ "$MODE" = "copy" ]; then
    # Copy local
    if [ -z "$2" ]; then
        echo -e "${RED}Lỗi: Cần chỉ định source path${NC}"
        exit 1
    fi
    
    SOURCE="$2"
    DEST="${3:-./inference_server}"
    
    echo -e "${YELLOW}Nguồn:${NC} $SOURCE"
    echo -e "${YELLOW}Đích:${NC} $DEST"
    echo ""
    
    echo -e "${GREEN}Đang copy...${NC}"
    echo "Loại trừ: .cache, .venv, __pycache__, .env, *.pyc"
    
    rsync -av --progress \
        --exclude-from="$EXCLUDE_FILE" \
        "$SOURCE/" "$DEST/"
    
    echo ""
    echo -e "${GREEN}✓ Hoàn thành!${NC}"
else
    echo -e "${RED}Lỗi: Mode không hợp lệ: $MODE${NC}"
    echo "Sử dụng: create-archive, download, hoặc copy"
    exit 1
fi

# Xóa file tạm
rm "$EXCLUDE_FILE"

if [ "$MODE" != "create-archive" ]; then
    echo ""
    echo "Các bước tiếp theo:"
    echo "  1. cd $DEST"
    echo "  2. python -m venv .venv"
    echo "  3. source .venv/bin/activate  # hoặc .venv\\Scripts\\activate trên Windows"
    echo "  4. pip install -r requirements.txt"
    echo "  5. cp env.sample .env"
    echo "  6. python -m src.api"
fi

