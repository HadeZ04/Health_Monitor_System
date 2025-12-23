# Kịch Bản Test RAG Cache Qua Frontend

## Mục đích
Test memory_map cache và hiệu năng RAG qua một chuỗi câu hỏi y tế thực tế.

## Kịch Bản Test

### Phase 1: Cold Cache (3 câu hỏi đầu)
**Mục tiêu**: Test performance khi cache trống (phải đọc từ disk)

1. **Câu hỏi 1**: "Bác sĩ ơi, bệnh tiểu đường là gì?"
   - **Kỳ vọng**: Latency ~50-100ms (cold cache)
   - **Kiểm tra**: Cache size tăng lên

2. **Câu hỏi 2**: "Làm thế nào để điều trị bệnh tiểu đường?"
   - **Kỳ vọng**: Latency có thể tương tự hoặc nhanh hơn một chút (một số files đã cache)
   - **Kiểm tra**: Cache size tiếp tục tăng

3. **Câu hỏi 3**: "Triệu chứng và nguyên nhân của bệnh tiểu đường là gì?"
   - **Kỳ vọng**: Latency giảm dần (cache đã warm up)
   - **Kiểm tra**: Cache size đạt ~3-5 files

### Phase 2: Cache Miss (2 câu hỏi mới chủ đề)
**Mục tiêu**: Test khi cần truy cập files mới

4. **Câu hỏi 4**: "Bệnh cao huyết áp là gì và cách điều trị?"
   - **Kỳ vọng**: Latency tăng một chút (cache miss, cần đọc files mới)
   - **Kiểm tra**: Cache size tăng, có thể đạt limit (10 files)

5. **Câu hỏi 5**: "Triệu chứng của bệnh tim mạch là gì?"
   - **Kỳ vọng**: Latency tương tự hoặc giảm (một số files đã cache)
   - **Kiểm tra**: Cache có thể đầy, files cũ bị xóa (FIFO)

### Phase 3: Cache Hit (Quay lại chủ đề cũ)
**Mục tiêu**: Test cache reuse - performance tốt nhất

6. **Câu hỏi 6**: "Thuốc điều trị tiểu đường loại nào hiệu quả?"
   - **Kỳ vọng**: Latency thấp nhất (~20-40ms) - cache hit!
   - **Kiểm tra**: Files tiểu đường đã có trong cache

7. **Câu hỏi 7**: "Bệnh tiểu đường type 2 có thể phòng ngừa không?"
   - **Kỳ vọng**: Latency vẫn thấp - cache hit tiếp tục
   - **Kiểm tra**: Cache reuse hiệu quả

### Phase 4: Stress Test (Nhiều queries liên tiếp)
**Mục tiêu**: Test cache dưới tải cao

8. **Câu hỏi 8**: "Insulin là gì và cách sử dụng?"
9. **Câu hỏi 9**: "Biến chứng của bệnh tiểu đường?"
10. **Câu hỏi 10**: "Chế độ ăn cho người tiểu đường?"

**Kỳ vọng**: 
- Latency ổn định (~20-50ms)
- Cache size giữ ở mức ~10 files (limit)
- Performance không suy giảm

## Danh Sách Câu Hỏi Đầy Đủ (Copy & Paste)

```
Bác sĩ ơi, bệnh tiểu đường là gì?

Làm thế nào để điều trị bệnh tiểu đường?

Triệu chứng và nguyên nhân của bệnh tiểu đường là gì?

Bệnh cao huyết áp là gì và cách điều trị?

Triệu chứng của bệnh tim mạch là gì?

Thuốc điều trị tiểu đường loại nào hiệu quả?

Bệnh tiểu đường type 2 có thể phòng ngừa không?

Insulin là gì và cách sử dụng?

Biến chứng của bệnh tiểu đường?

Chế độ ăn cho người tiểu đường?
```

## Cách Test Qua Frontend

### Option 1: Test Manual
1. Mở Frontend chat interface
2. Gửi từng câu hỏi theo thứ tự
3. Quan sát:
   - Thời gian phản hồi (latency)
   - Chất lượng câu trả lời
   - Số lượng citations/context docs

### Option 2: Test với API
```bash
# Test từng câu hỏi
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Bác sĩ ơi, bệnh tiểu đường là gì?",
    "session_id": "test-cache-1"
  }'
```

### Option 3: Script Test Tự Động
```bash
python test_cache_scenario.py
```

## Metrics Cần Quan Sát

1. **Latency (ms)**
   - Cold cache: ~50-100ms
   - Warm cache: ~20-40ms
   - Cache hit: ~20-30ms

2. **Cache Size**
   - Bắt đầu: 0 files
   - Sau 3 queries: ~3-5 files
   - Sau 5 queries: ~5-10 files
   - Limit: 10 files (FIFO)

3. **Document Quality**
   - Số lượng docs retrieved: 5 (top_k)
   - Score threshold: >= 0.4
   - Relevance: Kiểm tra title/abstract có liên quan

## Kết Quả Mong Đợi

✅ **Cache hoạt động tốt nếu:**
- Latency giảm dần từ query 1 → 3
- Query 6-7 nhanh hơn query 1-2 đáng kể (>30%)
- Cache size ổn định ở ~10 files
- Performance không suy giảm sau nhiều queries

❌ **Có vấn đề nếu:**
- Latency không giảm sau nhiều queries
- Cache size không tăng
- Performance suy giảm rõ rệt

## Debug Tips

Nếu cache không hoạt động:
1. Kiểm tra logs: `grep "cache" logs.txt`
2. Kiểm tra `retriever._file_cache` size
3. Verify arrow files được đọc đúng
4. Check disk I/O với `iostat` hoặc `iotop`

## Notes

- **Session ID**: Dùng cùng session_id để test memory consistency
- **Timing**: Nghỉ 1-2 giây giữa các queries để quan sát rõ hơn
- **Environment**: Test trên môi trường production-like để có kết quả chính xác

