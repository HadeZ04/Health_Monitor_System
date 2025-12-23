#!/usr/bin/env python3
"""Script test RAG để debug và kiểm tra hoạt động."""

import logging
import sys
from pathlib import Path

# Setup logging chi tiết
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Thêm src vào path
sys.path.insert(0, str(Path(__file__).parent))

from src.retriever import PubMedRetriever
from src.config import get_settings

def test_rag():
    """Test RAG retriever."""
    print("=" * 60)
    print("Bắt đầu test RAG...")
    print("=" * 60)
    
    try:
        # Load settings
        settings = get_settings()
        print(f"\n1. Settings loaded:")
        print(f"   - RAG cache dir: {settings.rag_cache_dir}")
        print(f"   - RAG repo ID: {settings.rag_repo_id}")
        print(f"   - Dataset dirname: {settings.rag_dataset_dirname}")
        print(f"   - Index file: {settings.rag_index_file}")
        
        # Khởi tạo retriever
        print(f"\n2. Đang khởi tạo PubMedRetriever...")
        retriever = PubMedRetriever(settings)
        
        # Kiểm tra trạng thái
        print(f"\n3. Trạng thái RAG:")
        print(f"   - Available: {retriever.available}")
        print(f"   - Index loaded: {retriever.index is not None}")
        if retriever.index:
            print(f"   - Index size: {retriever.index.ntotal} vectors")
        
        if hasattr(retriever, '_lazy_dataset') and retriever._lazy_dataset:
            print(f"   - Dataset mode: Lazy loading")
            print(f"   - Total rows: {retriever._total_rows}")
            print(f"   - Arrow files: {len(retriever._arrow_files)}")
        elif retriever.pubmed_ds:
            print(f"   - Dataset mode: In-memory")
            print(f"   - Dataset rows: {retriever.pubmed_ds.num_rows}")
        else:
            print(f"   - Dataset: Not loaded")
        
        if not retriever.available:
            print("\n❌ RAG không available! Kiểm tra logs ở trên để xem lỗi.")
            return False
        
        # Test encode query
        print(f"\n4. Test encode query...")
        import numpy as np
        test_query = "What is diabetes?"
        query_vec = retriever.encode_query(test_query)
        print(f"   - Query: '{test_query}'")
        print(f"   - Vector shape: {query_vec.shape}")
        print(f"   - Vector norm: {np.linalg.norm(query_vec):.4f}")
        
        # Test retrieve
        print(f"\n5. Test retrieve documents...")
        docs = retriever.retrieve(test_query, top_k=3)
        print(f"   - Retrieved {len(docs)} documents")
        
        for i, doc in enumerate(docs, 1):
            print(f"\n   Document {i}:")
            print(f"   - Title: {doc.get('title', 'N/A')[:80]}...")
            print(f"   - Abstract: {doc.get('abstract', 'N/A')[:100]}...")
            print(f"   - PMID: {doc.get('pmid', 'N/A')}")
            print(f"   - Score: {doc.get('score', 0.0):.4f}")
            print(f"   - Rank: {doc.get('rank', 'N/A')}")
        
        if docs:
            print("\n✅ RAG hoạt động tốt!")
            return True
        else:
            print("\n⚠️  RAG available nhưng không retrieve được documents!")
            return False
            
    except Exception as e:
        print(f"\n❌ Lỗi khi test RAG: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_rag()
    sys.exit(0 if success else 1)

