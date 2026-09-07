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
        results = self.retriever.search(
            query=query,
            top_k=top_k,
            categories=route["categories"] or None,
            jurisdiction=route["jurisdiction"]
        )

        print("\nRetrieved chunks:", len(results))

        # ---------------------------------------------------------
        # 3. THRESHOLD CHECK (AROUND 60% COSINE RELEVANCE)
        # ---------------------------------------------------------
        # User requirement: "make the rag threshold cosine relevance to around 60%
        # and when the cosine rel is above 60 then it should use retrieved info and by using llm it should give our info"
        COSINE_THRESHOLD = 0.58  # ~60% relevance threshold

        top_similarity = results[0]["similarity"] if results else 0.0

        if not results or top_similarity < COSINE_THRESHOLD:
            score_percent = round(top_similarity * 100, 1) if results else 0
            return {
                "query": query,
                "answer": (
                    f"The retrieved statutory documents have a cosine relevance match of {score_percent}%, "
                    f"which is below the required 60% threshold for an authoritative legal determination.\n\n"
                    "To generate a grounded statutory assessment, please provide more specific details about your inquiry "
                    "(such as exact medicinal plant species, formulation type, specific extraction solvent, or legal section)."
                ),
                "sources": [],
                "confidence": "Low",
                "disclaimer": (
                    "This information is for general guidance only and is not legal advice."
                ),
                "route": route
            }

        # Filter chunks that meet the relevance threshold
        filtered_results = [r for r in results if r["similarity"] >= 0.52]
        if not filtered_results:
            filtered_results = results[:3]

        # ---------------------------------------------------------
        # 4. BUILD EVIDENCE CONTEXT
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

            content = result["content"][:1200]

            context_parts.append(
                source_info +
                "\nEvidence:\n" +
                content
            )

        context = "\n\n".join(context_parts)

        # ---------------------------------------------------------
        # 5. STRICT GROUNDED PROMPT
        # ---------------------------------------------------------
        prompt = f"""
You are IP-SAKTI Sahayak, a retrieval-augmented assistant for
Intellectual Property and regulatory guidance related to Ayurveda.

Your task is to explain how the statutory rules, patent provisions, and guidelines
in the RETRIEVED EVIDENCE apply to the user's question or proposed invention.

STRICT GROUNDING RULES:

1. Explain how the statutory standards, exclusions, and requirements from the RETRIEVED EVIDENCE apply to the user's inquiry.

2. Do NOT add statutory sections, rules, dates, or legal requirements that are not present in the retrieved evidence.

3. Every important statutory statement must cite the source number and page.
   Example:
   "The guidelines state that patentability of traditional herbal combinations depends on demonstrating synergistic efficacy beyond a mere mixture under Section 3(e). [Source 1, Page 19]"

4. NEVER invent a source, page number, authority, quotation, or citation.

5. Keep the explanation simple, clear, and structured in plain English so inventors can understand.

6. Do not provide definitive legal advice.

11. End the answer with:
   "This information is for general guidance only and is not legal advice."

IMPORTANT:
The retrieved evidence may contain multiple sources or multiple chunks
from the same document. Treat each SOURCE separately and cite the exact
source/page that supports your statement.

USER QUESTION:
{query}

RETRIEVED EVIDENCE:
{context}

ANSWER:
"""

        # ---------------------------------------------------------
        # 6. GENERATE ANSWER
        # ---------------------------------------------------------
        print("\nSending retrieved evidence to Qwen3:8B...")

        answer = generate_answer(prompt).strip()

        # ---------------------------------------------------------
        # 7. CONFIDENCE
        # ---------------------------------------------------------
        top_similarity = filtered_results[0]["similarity"]

        if top_similarity >= 0.68:
            confidence = "High"
        elif top_similarity >= COSINE_THRESHOLD:
            confidence = "Medium"
        else:
            confidence = "Low"

        # ---------------------------------------------------------
        # 8. SOURCE INFORMATION
        # ---------------------------------------------------------
        sources = []

        for index, result in enumerate(filtered_results, start=1):

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
        # 9. FINAL RESPONSE
        # ---------------------------------------------------------
        return {
            "query": query,
            "answer": answer,
            "confidence": confidence,
            "sources": sources,
            "route": route,
            "disclaimer": (
                "This information is for general guidance only "
                "and is not legal advice."
            )
        }