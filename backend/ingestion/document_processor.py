import hashlib
from pathlib import Path

from backend.ingestion.pdf_loader import extract_text_from_pdf
from backend.ingestion.chunker import chunk_text
from backend.ingestion.source_registry import SOURCE_REGISTRY


def calculate_file_hash(file_path: str) -> str:
    """Calculate SHA-256 hash of a file."""
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        for block in iter(lambda: file.read(1024 * 1024), b""):
            sha256.update(block)

    return sha256.hexdigest()


def process_pdf(file_path: str) -> dict:
    """
    Process one PDF into page-level chunks with metadata.

    Returns:
        {
            filename,
            file_path,
            file_hash,
            page_count,
            chunks
        }
    """

    path = Path(file_path)

    # Extract PDF pages
    pages = extract_text_from_pdf(file_path)

    # Get source metadata
    source_metadata = SOURCE_REGISTRY.get(path.name, {})

    chunks = []

    for page in pages:

        # Skip image-only / empty pages
        if not page["text"]:
            continue

        page_chunks = chunk_text(page["text"])

        for chunk_index, text in enumerate(page_chunks):

            chunks.append({
                "text": text,
                "page_number": page["page_number"],
                "chunk_index": chunk_index,
                "metadata": source_metadata
            })

    return {
        "filename": path.name,
        "file_path": str(path),
        "file_hash": calculate_file_hash(file_path),
        "page_count": len(pages),
        "chunks": chunks
    }