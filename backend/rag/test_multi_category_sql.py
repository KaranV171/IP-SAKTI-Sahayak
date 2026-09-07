from backend.database import get_connection


def main():

    categories = [
        "Patents",
        "AYUSH IPR"
    ]

    jurisdiction = "India"

    placeholders = ", ".join(["%s"] * len(categories))

    sql = f"""
        SELECT
            dc.id,
            dc.category,
            dc.jurisdiction
        FROM document_chunks dc
        WHERE dc.category IN ({placeholders})
          AND dc.jurisdiction = %s
        LIMIT 10
    """

    parameters = categories + [jurisdiction]

    conn = get_connection()

    try:
        with conn.cursor() as cur:

            cur.execute(
                sql,
                parameters
            )

            rows = cur.fetchall()

            print()
            print("SQL test results:")
            print()

            for row in rows:
                print(
                    "Chunk ID:", row[0],
                    "| Category:", row[1],
                    "| Jurisdiction:", row[2]
                )

    finally:
        conn.close()


if __name__ == "__main__":
    main()