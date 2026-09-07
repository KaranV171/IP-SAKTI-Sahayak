import sys
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.rag.rag_engine import RAGEngine


engine = RAGEngine()


query = "Can I patent an Ayurvedic formulation?"


result = engine.answer(
    query=query,
    top_k=3
)


print("\n")
print("=" * 80)
print("FINAL RAG ANSWER")
print("=" * 80)

print(result["answer"])


print("\n")
print("=" * 80)
print("SOURCES")
print("=" * 80)

for index, source in enumerate(result["sources"], start=1):

    print(f"\nSource {index}")
    print("Title:", source["source_title"])
    print("Authority:", source["authority"])
    print("Page:", source["page_number"])
    print("Category:", source["category"])
    print("Similarity:", source["similarity"])