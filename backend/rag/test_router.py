from backend.rag.query_router import QueryRouter


def main():

    router = QueryRouter()

    queries = [
        "Can I patent an Ayurvedic formulation?",
        "What are the patentability requirements for an invention in India?",
        "What are the regulations for Ayurvedic food?",
        "What is traditional knowledge?"
    ]

    for query in queries:

        result = router.route(query)

        print("=" * 70)
        print("Query:", query)
        print("Intent:", result["intent"])
        print("Categories:", result["categories"])
        print("Jurisdiction:", result["jurisdiction"])


if __name__ == "__main__":
    main()