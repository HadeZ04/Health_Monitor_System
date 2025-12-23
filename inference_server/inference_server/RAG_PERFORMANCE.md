# RAG Performance Analysis

## Lazy Loading vs In-Memory

### Hiện tại: Lazy Loading (Memory Mapping)

**Ưu điểm:**
- ✅ Tiết kiệm RAM: Chỉ ~10-50MB thay vì ~1.2GB (cho 2.4M documents)
- ✅ Khởi động nhanh: Không cần load toàn bộ dataset vào RAM
- ✅ Phù hợp với server có RAM hạn chế

**Nhược điểm:**
- ⚠️ Mỗi lần retrieve cần đọc từ disk (I/O overhead)
- ⚠️ Latency cao hơn một chút so với in-memory

### Tối ưu đã áp dụng:

1. **Class-level file cache**: Cache các files đã mở giữa các lần retrieve
   - Giới hạn 10 files trong cache (~500MB max)
   - Tự động xóa file cũ nhất khi đầy (FIFO)
   - Giảm I/O khi các requests truy cập cùng files

2. **Memory mapping**: Sử dụng `pa.memory_map()` để OS tự quản lý cache
   - OS sẽ cache các phần thường dùng trong page cache
   - Hiệu quả hơn so với đọc file thông thường

## Performance Benchmarks (ước tính)

### Lazy Loading với cache:
- **Lần đầu retrieve** (cold cache): ~50-100ms
  - Encode query: ~10-20ms
  - FAISS search: ~5-10ms  
  - Đọc documents từ disk: ~30-70ms (tùy số files cần mở)
  
- **Lần sau** (warm cache): ~20-40ms
  - Encode query: ~10-20ms
  - FAISS search: ~5-10ms
  - Đọc từ cache: ~5-10ms

### In-Memory (nếu load toàn bộ):
- **Lần đầu retrieve**: ~20-30ms
  - Encode query: ~10-20ms
  - FAISS search: ~5-10ms
  - Đọc từ RAM: <1ms
- **RAM usage**: ~1.2GB

## Khi nào nên dùng In-Memory?

Nếu bạn có:
- ✅ RAM dư thừa (>16GB)
- ✅ Yêu cầu latency rất thấp (<20ms)
- ✅ Dataset nhỏ hơn (<1M documents)

Có thể sửa code để load toàn bộ dataset:

```python
# Trong retriever.py, thay vì lazy loading:
self.pubmed_ds = load_from_disk(str(dataset_path), keep_in_memory=True)
```

## Tối ưu thêm (nếu cần)

1. **Preload hot files**: Load các files thường dùng nhất vào cache khi khởi động
2. **LRU cache**: Thay FIFO bằng LRU để giữ files được truy cập gần đây
3. **SSD storage**: Đặt dataset trên SSD thay vì HDD để giảm I/O latency
4. **Batch retrieval**: Nếu có nhiều queries cùng lúc, batch lại để tận dụng cache

## Kết luận

Với 2.4M documents, lazy loading + cache là lựa chọn tốt vì:
- Tiết kiệm RAM đáng kể
- Performance vẫn chấp nhận được (~20-40ms warm cache)
- Cache giúp giảm I/O overhead
- Phù hợp với production server

Nếu cần latency thấp hơn và có đủ RAM, có thể chuyển sang in-memory mode.

