import pymupdf


def extract_text_from_pdf(file_path: str) -> list[dict]:
    """
    Extract text from a PDF page by page.

    Returns:
        A list of dictionaries containing:
        - page_number
        - text
    """

    document = pymupdf.open(file_path)

    pages = []

    try:
        for page_number, page in enumerate(document, start=1):
            text = page.get_text("text")

            pages.append({
                "page_number": page_number,
                "text": text.strip()
            })

    finally:
        document.close()

    return pages