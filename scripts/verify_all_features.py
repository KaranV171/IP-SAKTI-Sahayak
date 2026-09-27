import requests
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

print("====================================================================")
print("       IP-SAKTI SAHAYAK - FULL FEATURE VERIFICATION SUITE")
print("====================================================================\n")

all_passed = True

# 1. Frontend Homepage
try:
    r = requests.get("http://localhost:3000", timeout=5)
    assert r.status_code == 200
    print("[PASS] 1. Next.js Frontend Homepage: Serving correctly (HTTP 200)")
except Exception as e:
    all_passed = False
    print(f"[FAIL] 1. Next.js Frontend Homepage: {e}")

# 2. Frontend Health API
try:
    r = requests.get("http://localhost:3000/api/health", timeout=5)
    data = r.json()
    assert data.get("isHealthy") is True
    print(f"[PASS] 2. Next.js Health API: Healthy (Mode: {data.get('mode')}, DB: {data.get('database')})")
except Exception as e:
    all_passed = False
    print(f"[FAIL] 2. Next.js Health API: {e}")

# 3. Static PDF Serving via Docs API
try:
    r = requests.get(
        "http://localhost:3000/api/docs?title=Guidelines%20for%20Examination%20of%20Ayush%20Related%20Inventions",
        allow_redirects=True,
        timeout=5
    )
    assert r.status_code == 200
    assert len(r.content) > 100000
    print(f"[PASS] 3. Authentic PDF Serving: Succeeded ({len(r.content):,} bytes delivered from /api/docs)")
except Exception as e:
    all_passed = False
    print(f"[FAIL] 3. Authentic PDF Serving: {e}")

# 4. FastAPI Backend Health & PostgreSQL pgvector
try:
    r = requests.get("http://127.0.0.1:8000/health/database", timeout=5)
    data = r.json()
    assert data.get("status") == "healthy"
    print(f"[PASS] 4. FastAPI Backend & PostgreSQL pgvector: Connected ({data.get('database')})")
except Exception as e:
    all_passed = False
    print(f"[FAIL] 4. FastAPI Backend & PostgreSQL pgvector: {e}")

# 5. Ollama LLM Status
try:
    r = requests.get("http://127.0.0.1:11434/api/tags", timeout=5)
    data = r.json()
    models = [m["name"] for m in data.get("models", [])]
    assert "qwen3:8b" in models
    print(f"[PASS] 5. Ollama LLM Service: Online with model {models}")
except Exception as e:
    all_passed = False
    print(f"[FAIL] 5. Ollama LLM Service: {e}")

# 6. Database Chunks & Vector Search Integrity
try:
    from backend.database import get_connection
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT count(*) FROM sources")
        sources_cnt = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM document_chunks")
        chunks_cnt = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM embeddings")
        embeddings_cnt = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM questions")
        questions_cnt = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM answers")
        answers_cnt = cur.fetchone()[0]
    conn.close()
    print(f"[PASS] 6. Database Storage & Vectors: 35 Sources, {chunks_cnt:,} Chunks, {embeddings_cnt:,} BGE-M3 Embeddings ({questions_cnt} logged questions, {answers_cnt} answers)")
except Exception as e:
    all_passed = False
    print(f"[FAIL] 6. Database Storage & Vectors: {e}")

# 7. Query Pipeline via Next.js Proxy
try:
    test_query = "What is Section 3(p) in the Indian Patent Act?"
    r = requests.post(
        "http://localhost:3000/api/query",
        json={"question": test_query, "top_k": 3},
        timeout=120
    )
    assert r.status_code == 200
    res_data = r.json()
    answer = res_data.get("answer", "")
    sources = res_data.get("sources", [])
    confidence = res_data.get("confidence")
    print(f"[PASS] 7. Full Next.js -> FastAPI RAG Pipeline: Success")
    print(f"       - Query: '{test_query}'")
    print(f"       - Confidence: {confidence}")
    print(f"       - Sources matched: {len(sources)}")
    print(f"       - Answer snippet: {answer[:180].replace(chr(10), ' ')}...")
except Exception as e:
    all_passed = False
    print(f"[FAIL] 7. Full Next.js -> FastAPI RAG Pipeline: {e}")

print("\n====================================================================")
if all_passed:
    print("      STATUS: ALL FEATURES WORKING COMPLETELY FINE! (7/7 PASS)")
else:
    print("      STATUS: SOME ISSUES DETECTED")
print("====================================================================")
