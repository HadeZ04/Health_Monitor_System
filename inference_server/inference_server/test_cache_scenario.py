#!/usr/bin/env python3
"""Script test cache performance của RAG retriever."""

import logging
import time
import sys
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

sys.path.insert(0, str(Path(__file__).parent))

from src.retriever import PubMedRetriever
from src.config import get_settings

def test_cache_performance():
    """Test cache performance với các queries khác nhau."""
    print("=" * 70)
    print("TEST CACHE PERFORMANCE - RAG Retriever")
    print("=" * 70)
    
    settings = get_settings()
    retriever = PubMedRetriever(settings)
    
    if not retriever.available:
        print("❌ RAG không available!")
        return
    
    print(f"\n✅ RAG đã sẵn sàng")
    print(f"   - Cache size limit: {retriever._max_cache_size} files")
    print(f"   - Current cache: {len(retriever._file_cache)} files")
    
    # Danh sách câu hỏi test
    test_queries = [
        # Nhóm 1: Cùng chủ đề (sẽ hit cùng files) - Test cache hit
        ("What is diabetes?", "Diabetes type 1"),
        ("How to treat diabetes?", "Diabetes management"),
        ("Diabetes symptoms and causes", "Diabetes complications"),
        
        # Nhóm 2: Chủ đề khác (có thể hit files khác) - Test cache miss
        ("What is hypertension?", "Hypertension treatment"),
        ("Heart disease symptoms", "Cardiovascular disease"),
        
        # Nhóm 3: Quay lại chủ đề cũ (sẽ hit cache) - Test cache reuse
        ("Diabetes medication", "Insulin therapy"),
        ("Type 2 diabetes", "Diabetes prevention"),
    ]
    
    print("\n" + "=" * 70)
    print("BẮT ĐẦU TEST CACHE")
    print("=" * 70)
    
    results = []
    
    for i, (query, description) in enumerate(test_queries, 1):
        print(f"\n[{i}/{len(test_queries)}] Query: '{query}'")
        print(f"   Description: {description}")
        
        # Đo thời gian
        start_time = time.time()
        docs = retriever.retrieve(query, top_k=5)
        elapsed = (time.time() - start_time) * 1000  # ms
        
        # Kiểm tra cache status
        cache_size = len(retriever._file_cache)
        
        print(f"   ⏱️  Latency: {elapsed:.2f}ms")
        print(f"   📄 Retrieved: {len(docs)} documents")
        print(f"   💾 Cache size: {cache_size} files")
        
        if docs:
            print(f"   📊 Top score: {docs[0].get('score', 0):.4f}")
            # Hiển thị files được truy cập (từ indices)
            indices = [doc.get('rank', 0) for doc in docs]
            print(f"   🔍 Document indices: {indices[:3]}...")
        
        results.append({
            'query': query,
            'latency_ms': elapsed,
            'docs_count': len(docs),
            'cache_size': cache_size,
        })
        
        # Nghỉ một chút giữa các queries
        time.sleep(0.1)
    
    # Phân tích kết quả
    print("\n" + "=" * 70)
    print("PHÂN TÍCH KẾT QUẢ")
    print("=" * 70)
    
    # Tính trung bình latency
    latencies = [r['latency_ms'] for r in results]
    avg_latency = sum(latencies) / len(latencies)
    
    # Phân loại: cold cache (3 queries đầu) vs warm cache (các query sau)
    cold_latencies = latencies[:3]
    warm_latencies = latencies[3:]
    
    print(f"\n📈 Thống kê:")
    print(f"   - Tổng queries: {len(results)}")
    print(f"   - Latency trung bình: {avg_latency:.2f}ms")
    print(f"   - Cold cache (3 queries đầu): {sum(cold_latencies)/len(cold_latencies):.2f}ms")
    if warm_latencies:
        print(f"   - Warm cache (các query sau): {sum(warm_latencies)/len(warm_latencies):.2f}ms")
        improvement = ((sum(cold_latencies)/len(cold_latencies) - sum(warm_latencies)/len(warm_latencies)) / 
                      (sum(cold_latencies)/len(cold_latencies))) * 100
        print(f"   - Cải thiện: {improvement:.1f}%")
    
    print(f"\n💾 Cache cuối cùng:")
    print(f"   - Files trong cache: {len(retriever._file_cache)}")
    print(f"   - Cache limit: {retriever._max_cache_size}")
    
    # Test cache hit bằng cách query lại
    print("\n" + "=" * 70)
    print("TEST CACHE HIT - Query lại câu hỏi đầu tiên")
    print("=" * 70)
    
    first_query = test_queries[0][0]
    print(f"\nQuery lại: '{first_query}'")
    
    start_time = time.time()
    docs = retriever.retrieve(first_query, top_k=5)
    elapsed = (time.time() - start_time) * 1000
    
    print(f"   ⏱️  Latency: {elapsed:.2f}ms")
    print(f"   💾 Cache size: {len(retriever._file_cache)} files")
    
    first_latency = results[0]['latency_ms']
    if elapsed < first_latency:
        improvement = ((first_latency - elapsed) / first_latency) * 100
        print(f"   ✅ Cache hit! Nhanh hơn {improvement:.1f}% so với lần đầu")
    else:
        print(f"   ⚠️  Latency tương tự (có thể do overhead khác)")
    
    print("\n" + "=" * 70)
    print("✅ TEST HOÀN TẤT")
    print("=" * 70)

if __name__ == "__main__":
    test_cache_performance()

