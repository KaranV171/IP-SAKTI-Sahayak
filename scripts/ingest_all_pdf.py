from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.database import get_connection
from backend.ingestion.document_processor import process_pdf
from backend.ingestion.source_registry import SOURCE_REGISTRY


PDF_FOLDER = PROJECT_ROOT / "IP-SAKTI-DATA" / "Data" / "pdf"


def ingest_pdf(file_path: Path):
    print(f"\nProcessing: {file_path.name}")

    # Check registry
    if file_path.name not in SOURCE_REGISTRY:
        print("ERROR: PDF is missing from SOURCE_REGISTRY")
        return "error", 0

    # Process PDF
    result = process_pdf(str(file_path))

    metadata = SOURCE_REGISTRY[file_path.name]

    conn = get_connection()

    try:
        with conn.cursor() as cur:

            # Check duplicate using file hash
            cur.execute(
                """
                SELECT id
                FROM documents
                WHERE file_hash = %s
                """,
                (result["file_hash"],)
            )

            existing_document = cur.fetchone()

            if existing_document:
                print(f"Already ingested. Document ID: {existing_document[0]}")
                return "already_exists", 0

            # Insert source
            cur.execute(
                """
                INSERT INTO sources (
                    title,
                    source_type,
                    jurisdiction,
                    category,
                    authority
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    metadata["title"],
                    metadata["source_type"],
                    metadata["jurisdiction"],
                    metadata["category"],
                    metadata["authority"],
                )
            )

            source_id = cur.fetchone()[0]

            # Insert document
            cur.execute(
                """
                INSERT INTO documents (
                    source_id,
                    filename,
                    file_path,
                    file_hash,
                    page_count,
                    processed
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    source_id,
                    result["filename"],
                    result["file_path"],
                    result["file_hash"],
                    result["page_count"],
                    True,
                )
            )

            document_id = cur.fetchone()[0]

            # Insert chunks
            chunk_count = 0

            for chunk in result["chunks"]:
                cur.execute(
                    """
                    INSERT INTO document_chunks (
                        document_id,
                        chunk_index,
                        page_number,
                        content,
                        jurisdiction,
                        category
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        document_id,
                        chunk["chunk_index"],
                        chunk["page_number"],
                        chunk["text"],
                        metadata["jurisdiction"],
                        metadata["category"],
                    )
                )

                chunk_count += 1

            conn.commit()

            print(
                f"Ingested successfully: "
                f"{result['page_count']} pages, "
                f"{chunk_count} chunks"
            )

            return "new", chunk_count

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


def main():

    pdf_files = sorted(PDF_FOLDER.glob("*.pdf"))

    print("========================================")
    print("IP-SAKTI Sahayak - PDF Ingestion")
    print("========================================")
    print("PDFs found:", len(pdf_files))
    print()

    new_count = 0
    already_exists_count = 0
    error_count = 0
    total_chunks = 0

    for pdf_file in pdf_files:

        try:
            status, chunks = ingest_pdf(pdf_file)

            if status == "new":
                new_count += 1
                total_chunks += chunks

            elif status == "already_exists":
                already_exists_count += 1

            elif status == "error":
                error_count += 1

        except Exception as e:
            error_count += 1
            print(f"ERROR: {e}")

    print()
    print("========================================")
    print("INGESTION SUMMARY")
    print("========================================")
    print("PDFs found:", len(pdf_files))
    print("Newly ingested:", new_count)
    print("Already existed:", already_exists_count)
    print("Errors:", error_count)
    print("New chunks inserted:", total_chunks)
    print("========================================")


if __name__ == "__main__":
    main()