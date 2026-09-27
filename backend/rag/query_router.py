class QueryRouter:

    def route(self, query: str) -> dict:
        query_lower = query.lower()

        intent = "general"
        categories = []

        # -----------------------------
        # 1. Food & FSSAI (Ayurveda Aahara)
        # -----------------------------
        food_keywords = [
            "fssai",
            "food",
            "aahara",
            "diet",
            "dietary",
            "supplement",
            "nutraceutical",
            "nutrition",
            "edible",
            "consum"
        ]

        is_food = any(k in query_lower for k in food_keywords)
        if is_food:
            intent = "food_regulatory"
            categories.extend(["Ayurveda Food / FSSAI", "Ayurveda", "Drugs & Regulatory"])

        # -----------------------------
        # 2. Biodiversity & NBA Clearance
        # -----------------------------
        nba_keywords = [
            "biodiversity",
            "nba",
            "national biodiversity",
            "biological resource",
            "access and benefit",
            "abs",
            "sbb",
            "state biodiversity"
        ]

        is_nba = any(k in query_lower for k in nba_keywords)
        if is_nba:
            intent = "biodiversity"
            categories.extend(["Biodiversity / ABS", "Traditional Knowledge / Genetic Resources"])

        # -----------------------------
        # 3. Traditional Knowledge & TKDL
        # -----------------------------
        tk_keywords = [
            "traditional knowledge",
            "tkdl",
            "biopiracy",
            "classical treatise",
            "charaka",
            "sushruta",
            "samhita",
            "wipo"
        ]

        is_tk = any(k in query_lower for k in tk_keywords)
        if is_tk:
            if intent == "general":
                intent = "traditional_knowledge"
            categories.extend(["Traditional Knowledge / Genetic Resources", "AYUSH IPR", "Patents"])

        # -----------------------------
        # 4. Patents & Inventions
        # -----------------------------
        patent_keywords = [
            "patent",
            "patentable",
            "patentability",
            "invention",
            "inventive step",
            "novelty",
            "prior art",
            "section 3",
            "section 3(p)",
            "section 3(e)",
            "section 3(d)",
            "synerg"
        ]

        is_patent = any(k in query_lower for k in patent_keywords)
        if is_patent:
            intent = "patent"
            categories.extend(["Patents", "AYUSH IPR"])

        # -----------------------------
        # 5. Drugs & Licensing Compliance
        # -----------------------------
        drug_keywords = [
            "drug",
            "drugs",
            "clinical",
            "manufacture",
            "manufacturing",
            "license",
            "licensing",
            "schedule t",
            "schedule m",
            "compliance",
            "drugs rules"
        ]

        is_drug = any(k in query_lower for k in drug_keywords)
        if is_drug:
            if intent == "general":
                intent = "drug_regulatory"
            categories.extend(["Drugs & Regulatory", "Ayurveda", "AYUSH IPR"])

        # -----------------------------
        # 6. Trademarks & Brand Protection
        # -----------------------------
        if any(k in query_lower for k in ["trademark", "trade mark", "brand name", "logo", "class 5"]):
            intent = "trademark"
            categories.append("Trademarks")

        # -----------------------------
        # 7. Geographical Indications
        # -----------------------------
        if any(k in query_lower for k in ["geographical indication", "gi tag", "gi registration"]):
            intent = "geographical_indication"
            categories.append("Geographical Indications")

        # -----------------------------
        # 8. General Ayurveda
        # -----------------------------
        ayurveda_keywords = [
            "ayurveda",
            "ayurvedic",
            "formulation",
            "herbal",
            "medicinal plant",
            "traditional medicine",
            "churna",
            "bhasma",
            "kwatha",
            "taila"
        ]

        if any(k in query_lower for k in ayurveda_keywords):
            if not categories:
                # If pure general Ayurveda without specific topic, search across Ayurveda, AYUSH IPR, and Patents
                categories.extend(["Ayurveda", "AYUSH IPR", "Patents"])

        # Deduplicate while preserving order
        unique_categories = list(dict.fromkeys(categories))

        # Jurisdiction default
        jurisdiction = "India"

        return {
            "intent": intent,
            "categories": unique_categories,
            "jurisdiction": jurisdiction
        }