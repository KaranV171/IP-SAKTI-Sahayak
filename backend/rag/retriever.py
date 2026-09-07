from sentence_transformers import SentenceTransformer

from backend.database import get_connection


MODEL_NAME = "BAAI/bge-m3"
TOP_K = 5


class Retriever:

    def __init__(self):
        print("Loading BGE-M3 for retrieval...")

        self.model = SentenceTransformer(
            MODEL_NAME,
            device="cuda"
        )

        print("BGE-M3 loaded.")
        print("Device:", self.model.device)

    def search(
        self,
        query: str,
        top_k: int = TOP_K,
        categories: list[str] | None = None,
        jurisdiction: str | None = None
    ):
        """
        Search the knowledge base using BGE-M3
        semantic similarity with optional metadata filters.
        """

        # ==================================================
        # 1. Generate query embedding
        # ==================================================

        query_embedding = self.model.encode(
            query,
            normalize_embeddings=True
        ).tolist()

        print()
        print("Query embedding dimensions:", len(query_embedding))

        # ==================================================
        # 2. Build metadata filters
        # ==================================================

        conditions = []
        filter_parameters = []

        if categories:
            placeholders = ", ".join(
                ["%s"] * len(categories)
            )

            conditions.append(
                f"dc.category IN ({placeholders})"
            )

            filter_parameters.extend(categories)

        if jurisdiction:
            conditions.append(
                "dc.jurisdiction = %s"
            )

            filter_parameters.append(jurisdiction)

        # ==================================================
        # 3. Build WHERE clause
        # ==================================================

        where_clause = ""

        if conditions:
            where_clause = (
                "WHERE " + " AND ".join(conditions)
            )

        # ==================================================
        # 4. SQL query
        # ==================================================

        sql = f"""
            SELECT
                dc.id,
                dc.content,
                dc.page_number,
                dc.section_title,
                dc.jurisdiction,
                dc.category,
                d.filename,
                s.title,
                s.authority,
                s.source_url,
                1 - (e.embedding <=> %s::vector) AS similarity

            FROM embeddings e

            JOIN document_chunks dc
                ON dc.id = e.chunk_id

            JOIN documents d
                ON d.id = dc.document_id

            LEFT JOIN sources s
                ON s.id = d.source_id

            {where_clause}

            ORDER BY e.embedding <=> %s::vector

            LIMIT %s
        """

        # ==================================================
        # 5. Build parameters
        # ==================================================

        sql_parameters = []

        # SELECT embedding
        sql_parameters.append(query_embedding)

        # Category + jurisdiction
        sql_parameters.extend(filter_parameters)

        # ORDER BY embedding
        sql_parameters.append(query_embedding)

        # LIMIT
        sql_parameters.append(top_k)

        # ==================================================
        # 6. Database connection
        # ==================================================

        conn = get_connection()

        try:

            with conn.cursor() as cur:

                # --------------------------------------------------
                # TEMPORARY DEBUG:
                # Force PostgreSQL to avoid index scans.
                #
                # This lets us test whether HNSW is causing the
                # metadata-filtered search to return zero rows.
                # --------------------------------------------------

                cur.execute(
                    "SET LOCAL enable_indexscan = off"
                )

                cur.execute(
                    "SET LOCAL enable_bitmapscan = off"
                )

                # ==================================================
                # 7. Debug SQL
                # ==================================================

                print()
                print("=" * 80)
                print("DEBUG SQL")
                print("=" * 80)

                print(sql)

                print()
                print("=" * 80)
                print("DEBUG PARAMETERS")
                print("=" * 80)

                print(
                    "Number of parameters:",
                    len(sql_parameters)
                )

                for index, parameter in enumerate(
                    sql_parameters
                ):

                    if isinstance(parameter, list):

                        print(
                            index,
                            "-> embedding",
                            "| dimensions:",
                            len(parameter)
                        )

                    else:

                        print(
                            index,
                            "->",
                            parameter
                        )

                print()

                # ==================================================
                # 8. Execute vector search
                # ==================================================

                cur.execute(
                    sql,
                    sql_parameters
                )

                rows = cur.fetchall()

                print(
                    "Database rows returned:",
                    len(rows)
                )

                # ==================================================
                # 9. Convert rows into results
                # ==================================================

                results = []

                for row in rows:

                    results.append({

                        "chunk_id": row[0],

                        "content": row[1],

                        "page_number": row[2],

                        "section_title": row[3],

                        "jurisdiction": row[4],

                        "category": row[5],

                        "filename": row[6],

                        "source_title": row[7],

                        "authority": row[8],

                        "source_url": row[9],

                        "similarity": float(row[10])

                    })

                return results

        finally:

            conn.close()