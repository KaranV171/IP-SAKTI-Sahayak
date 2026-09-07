from pathlib import Path
import sys


# Add project root to Python path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))


from backend.ingestion.pdf_loader import extract_text_from_pdf


# Real PDF folder
pdf_folder = PROJECT_ROOT / "IP-SAKTI-DATA" / "Data" / "pdf"

pdfs = list(pdf_folder.glob("*.pdf"))

total_pages = 0
total_empty_pages = 0

print("PDF files:", len(pdfs))
print()

for pdf in pdfs:
    try:
        pages = extract_text_from_pdf(str(pdf))

        empty_pages = sum(
            1
            for page in pages
            if not page["text"]
        )

        total_pages += len(pages)
        total_empty_pages += empty_pages

        print(
            f"{pdf.name}: "
            f"{len(pages)} pages, "
            f"empty pages: {empty_pages}"
        )

    except Exception as e:
        print(f"{pdf.name}: ERROR - {e}")


print()
print("========================================")
print("Total PDF files:", len(pdfs))
print("Total pages:", total_pages)
print("Total empty pages:", total_empty_pages)
print("========================================")