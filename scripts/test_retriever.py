import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))




from backend.rag.retriever import Retriever


def main():

    retriever = Retriever()

    query = "Can I patent an Ayurvedic formulation?"

    categories = [
        "Patents",
        "AYUSH IPR"
    ]

    jurisdiction = "India"

    print()
    print("Query:", query)
    print("Categories:", categories)
    print("Jurisdiction:", jurisdiction)
    print()
    print("Searching...")
    print()

    results = retriever.search(
        query=query,
        top_k=10,
        categories=categories,
        jurisdiction=jurisdiction
    )

    if not results:
        print("NO RESULTS FOUND")
        return

    for i, result in enumerate(results, start=1):

        print("=" * 80)
        print(f"RESULT {i}")
        print("=" * 80)

        print("Similarity:", round(result["similarity"], 4))
        print("Source:", result["source_title"])
        print("File:", result["filename"])
        print("Page:", result["page_number"])
        print("Category:", result["category"])
        print("Jurisdiction:", result["jurisdiction"])
        print("Authority:", result["authority"])

        print()
        print("Content:")
        print(result["content"][:1200])
        print()


if __name__ == "__main__":
    main()