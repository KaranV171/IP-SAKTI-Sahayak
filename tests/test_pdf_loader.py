from pathlib import Path

from backend.ingestion.pdf_loader import extract_text_from_pdf


def test_pdf_loader():
    test_pdf = Path("tests/test_document.pdf")

    pages = extract_text_from_pdf(test_pdf)

    assert len(pages) > 0
    assert "page_number" in pages[0]
    assert "text" in pages[0] 