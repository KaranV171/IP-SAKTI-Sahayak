from typing import List


def clean_text(text: str) -> str:
    """
    Basic text cleaning.

    Removes unnecessary whitespace while preserving
    the actual document content.
    """

    lines = text.splitlines()

    cleaned_lines = []

    for line in lines:
        line = line.strip()

        if line:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines)


def chunk_text(
    text: str,
    chunk_size: int = 1200,
    overlap: int = 200
) -> List[str]:
    """
    Split text into overlapping chunks.

    Args:
        text:
            Text extracted from a document.

        chunk_size:
            Approximate maximum number of characters
            in each chunk.

        overlap:
            Number of characters shared between
            consecutive chunks.

    Returns:
        List of text chunks.
    """

    text = clean_text(text)

    if not text:
        return []

    if overlap >= chunk_size:
        raise ValueError(
            "overlap must be smaller than chunk_size"
        )

    chunks = []

    start = 0
    text_length = len(text)

    while start < text_length:

        end = min(
            start + chunk_size,
            text_length
        )

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        start = end - overlap

    return chunks