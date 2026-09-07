from sentence_transformers import SentenceTransformer

from backend.database import get_connection


MODEL_NAME = "BAAI/bge-m3"
BATCH_SIZE = 16


def main():
    print("Loading BGE-M3...")

    model = SentenceTransformer(
        MODEL_NAME,
        device="cuda"
    )

    print("Model loaded.")
    print("Device:", model.device)

    conn = get_connection()

    try:
        with conn.cursor() as cur:

            # Find chunks that do not have an embedding yet
            cur.execute(
                """
                SELECT dc.id, dc.content
                FROM document_chunks dc
                LEFT JOIN embeddings e
                    ON e.chunk_id = dc.id
                WHERE e.chunk_id IS NULL
                ORDER BY dc.id
                """
            )

            rows = cur.fetchall()

            total = len(rows)

            print("Chunks without embeddings:", total)

            if total == 0:
                print("All chunks already have embeddings.")
                return

            # Process in batches
            for start in range(0, total, BATCH_SIZE):

                batch = rows[start:start + BATCH_SIZE]

                chunk_ids = [row[0] for row in batch]
                texts = [row[1] for row in batch]

                print(
                    f"Embedding chunks "
                    f"{start + 1}-{start + len(batch)} "
                    f"of {total}..."
                )

                embeddings = model.encode(
                    texts,
                    batch_size=BATCH_SIZE,
                    normalize_embeddings=True,
                    show_progress_bar=False
                )

                # Insert embeddings
                for chunk_id, embedding in zip(chunk_ids, embeddings):

                    cur.execute(
                        """
                        INSERT INTO embeddings (
                            chunk_id,
                            embedding
                        )
                        VALUES (%s, %s)
                        """,
                        (
                            chunk_id,
                            embedding.tolist()
                        )
                    )

                conn.commit()

            print()
            print("All embeddings inserted successfully.")

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


if __name__ == "__main__":
    main()