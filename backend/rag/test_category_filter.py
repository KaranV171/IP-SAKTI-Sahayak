from backend.database import get_connection


def main():

    conn = get_connection()

    try:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    category,
                    jurisdiction,
                    COUNT(*)
                FROM document_chunks
                WHERE category IN ('Patents', 'AYUSH IPR')
                  AND jurisdiction = 'India'
                GROUP BY category, jurisdiction
                ORDER BY category
                """
            )

            rows = cur.fetchall()

            print()
            print("Matching chunks:")
            print()

            if not rows:
                print("NO MATCHES")
                return

            for row in rows:
                print(
                    "Category:",
                    row[0],
                    "| Jurisdiction:",
                    row[1],
                    "| Chunks:",
                    row[2]
                )

    finally:
        conn.close()


if __name__ == "__main__":
    main()