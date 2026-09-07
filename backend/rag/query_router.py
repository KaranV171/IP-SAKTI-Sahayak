class QueryRouter:

    def route(self, query: str) -> dict:
        query_lower = query.lower()

        intent = "general"
        categories = []

        # -----------------------------
        # Patent detection
        # -----------------------------
        patent_keywords = [
            "patent",
            "patentable",
            "patentability",
            "invention",
            "inventive step",
            "novelty",
            "prior art"
        ]

        if any(
            keyword in query_lower
            for keyword in patent_keywords
        ):
            intent = "patent"
            categories.append("Patents")

        # -----------------------------
        # Ayurveda detection
        # -----------------------------
        ayurveda_keywords = [
            "ayurveda",
            "ayurvedic",
            "formulation",
            "herbal",
            "medicinal plant",
            "traditional medicine"
        ]

        is_ayurveda = any(
            keyword in query_lower
            for keyword in ayurveda_keywords
        )

        # -----------------------------
        # AYUSH IPR
        # -----------------------------
        if is_ayurveda and intent == "patent":
            categories.append("AYUSH IPR")

        elif is_ayurveda:
            categories.append("Ayurveda")

        # -----------------------------
        # Jurisdiction
        # -----------------------------
        if (
            "india" in query_lower
            or "indian" in query_lower
            or "in india" in query_lower
        ):
            jurisdiction = "India"
        else:
            jurisdiction = "India"

        return {
            "intent": intent,
            "categories": categories,
            "jurisdiction": jurisdiction
        }