from backend.rag.llm import generate_answer
from backend.rag.query_router import QueryRouter
from backend.rag.retriever import Retriever


class RAGEngine:
    def __init__(self):
        print("Initializing RAG Engine...")

        self.router = QueryRouter()
        self.retriever = Retriever()

        print("RAG Engine ready.")

    def answer(self, query: str, top_k: int = 3) -> dict:

        # ---------------------------------------------------------
        # 1. QUERY ROUTING
        # ---------------------------------------------------------
        route = self.router.route(query)

        print("\n" + "=" * 80)
        print("QUERY ROUTING")
        print("=" * 80)

        print("Query:", query)
        print("Intent:", route["intent"])
        print("Categories:", route["categories"])
        print("Jurisdiction:", route["jurisdiction"])

        # ---------------------------------------------------------
        # 2. RETRIEVAL
        # ---------------------------------------------------------
        try:
            results = self.retriever.search(
                query=query,
                top_k=top_k,
                categories=route["categories"] or None,
                jurisdiction=route["jurisdiction"]
            )
        except Exception as search_err:
            print(f"[WARNING] Database retrieval failed or timed out: {search_err}")
            results = []

        print("\nRetrieved chunks:", len(results))

        # ---------------------------------------------------------
        # 3. BUILD SOURCE INFORMATION FOR ALL RETRIEVED CHUNKS
        # ---------------------------------------------------------
        sources = []
        for index, result in enumerate(results[:top_k], start=1):
            sources.append({
                "source_number": index,
                "source_title": result["source_title"],
                "authority": result["authority"],
                "page_number": result["page_number"],
                "category": result["category"],
                "jurisdiction": result["jurisdiction"],
                "source_url": result["source_url"],
                "similarity": round(result["similarity"], 4)
            })

        # ---------------------------------------------------------
        # 4. THRESHOLD CHECK FOR GROUNDED LEGAL REASONING
        # ---------------------------------------------------------
        # BGE-M3 cosine similarity threshold for statutory grounding
        COSINE_THRESHOLD = 0.48

        top_similarity = results[0]["similarity"] if results else 0.0

        if not results or top_similarity < COSINE_THRESHOLD:
            score_percent = round(top_similarity * 100, 1) if results else 0
            return {
                "query": query,
                "answer": (
                    f"The retrieved statutory documents have a cosine relevance match of {score_percent}%, "
                    f"which is below the threshold for an authoritative determination.\n\n"
                    "To generate a grounded statutory assessment, please provide more specific details about your inquiry "
                    "(such as exact medicinal plant species, formulation type, specific extraction solvent, or legal section)."
                ),
                "sources": sources,
                "confidence": "Low",
                "disclaimer": (
                    "This information is for general guidance only and is not legal advice."
                ),
                "route": route
            }

        # Filter chunks that meet the relevance threshold
        filtered_results = [r for r in results if r["similarity"] >= 0.45]
        if not filtered_results:
            filtered_results = results[:3]

        # ---------------------------------------------------------
        # 5. BUILD EVIDENCE CONTEXT
        # ---------------------------------------------------------
        context_parts = []

        for index, result in enumerate(filtered_results, start=1):
            source_info = (
                f"[SOURCE {index}]\n"
                f"Title: {result['source_title']}\n"
                f"Authority: {result['authority']}\n"
                f"Page: {result['page_number']}\n"
                f"Category: {result['category']}\n"
                f"Jurisdiction: {result['jurisdiction']}\n"
            )

            content = result["content"][:900]

            context_parts.append(
                source_info +
                "\nEvidence:\n" +
                content
            )

        context = "\n\n".join(context_parts)

        # ---------------------------------------------------------
        # 6. GROUNDED STEP-BY-STEP REASONING PROMPT
        # ---------------------------------------------------------
        prompt = f"""You are IP-SAKTI Sahayak, an authoritative research assistant for Intellectual Property and regulatory guidance in AYUSH and Ayurveda.

Your task is to provide clear, structured, step-by-step statutory reasoning on how the RETRIEVED EVIDENCE applies to the USER QUESTION.

STRICT GROUNDING & REASONING RULES:
1. Provide step-by-step reasoning explaining how the statutory provisions, guidelines, or requirements apply to the inquiry.
2. For each key statutory statement or rule, cite the exact source number and page: e.g. [Source 1, Page 9].
3. Structure your response with an Executive Summary followed by point-by-point statutory guidance with clear bold headings.
4. Keep the explanation simple, clear, and grounded strictly in the provided evidence. Do not hallucinate sections or rules not in the evidence.
5. End with: "This information is for general guidance only and is not legal advice."

USER QUESTION:
{query}

RETRIEVED EVIDENCE:
{context}

ANSWER:
"""

        # ---------------------------------------------------------
        # 7. GENERATE ANSWER
        # ---------------------------------------------------------
        print("\nSending retrieved evidence to Qwen3:8B for reasoning...")

        answer = generate_answer(prompt).strip()

        # ---------------------------------------------------------
        # 8. CONFIDENCE
        # ---------------------------------------------------------
        top_similarity = filtered_results[0]["similarity"]

        if top_similarity >= 0.62:
            confidence = "High"
        elif top_similarity >= COSINE_THRESHOLD:
            confidence = "Medium"
        else:
            confidence = "Low"

        # Update sources list specifically matching filtered results
        final_sources = []
        for index, result in enumerate(filtered_results, start=1):
            final_sources.append({
                "source_number": index,
                "source_title": result["source_title"],
                "authority": result["authority"],
                "page_number": result["page_number"],
                "category": result["category"],
                "jurisdiction": result["jurisdiction"],
                "source_url": result["source_url"],
                "similarity": round(result["similarity"], 4)
            })

        # ---------------------------------------------------------
        # 9. FINAL RESPONSE
        # ---------------------------------------------------------
        return {
            "query": query,
            "answer": answer,
            "confidence": confidence,
            "sources": final_sources,
            "route": route,
            "disclaimer": (
                "This information is for general guidance only "
                "and is not legal advice."
            )
        }