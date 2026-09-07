from sentence_transformers import SentenceTransformer

from backend.database import get_connection


MODEL_NAME = "BAAI/bge-m3"


def main():
    print("Loading BGE-M3...")

    model = SentenceTransformer(
        MODEL_NAME,
        device="cuda"
    )

    print("Model loaded.")

    conn = get_connection()

    try:
        with conn.cursor() as cur:

            # Get one existing chunk
            cur.execute(
                """
                SELECT id, content
                FROM document_chunks
                ORDER BY id
                LIMIT 1
                """
            )

            row = cur.fetchone()

            if row is None:
                raise RuntimeError("No document chunks found.")

            chunk_id = row[0]
            content = row[1]

            print("Chunk ID:", chunk_id)
            print("Generating embedding...")

            embedding = model.encode(
                content,
                normalize_embeddings=True
            )

            print("Embedding dimensions:", len(embedding))

            # Convert NumPy array to normal Python list
            embedding_list = embedding.tolist()

            # Insert embedding
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
                    embedding_list
                )
            )

            conn.commit()

            print("Embedding inserted successfully.")
            print("Chunk ID:", chunk_id)

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


if __name__ == "__main__":
    main()