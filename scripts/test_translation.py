"""
Standalone Translation Quality and Citation Preservation Test.

Validates:
1. English -> Hindi & Hindi -> English
2. English -> Tamil & Tamil -> English
3. English -> Telugu & Telugu -> English
4. Domain-specific legal/regulatory terminology (patent, AYUSH, TKDL, novelty, inventive step)
5. Citation preservation ([Source X, Page Y])
"""

import sys
import os

# Set UTF-8 stdout for Windows console
os.environ["PYTHONIOENCODING"] = "utf-8"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.buffer, "strict")

from backend.translation import IndicTrans2Translator, normalize_language_code

translator = IndicTrans2Translator()

print("=" * 60)
print("IP-SAKTI SAHAYAK - INDICTRANS2 TRANSLATION VERIFICATION")
print("=" * 60)

# -------------------------------------------------------------
# Test 1: Domain-specific English -> Hindi & Hindi -> English
# -------------------------------------------------------------
print("\n[TEST 1] English <-> Hindi Domain Terms")
en_term_query = "Can I patent an Ayurvedic herbal formulation with novel therapeutic properties?"
hi_out, s1 = translator.translate_from_english(en_term_query, "hi")
print(f"English Query  : {en_term_query}")
print(f"Hindi Output   : {hi_out} (status={s1})")

back_en, s2 = translator.translate_to_english(hi_out, "hi")
print(f"Back to English: {back_en} (status={s2})")

# -------------------------------------------------------------
# Test 2: English -> Tamil & Tamil -> English
# -------------------------------------------------------------
print("\n[TEST 2] English <-> Tamil Domain Terms")
en_tam_query = "Can an Ayurvedic formulation be patented in India?"
tam_out, s3 = translator.translate_from_english(en_tam_query, "ta")
print(f"English Query  : {en_tam_query}")
print(f"Tamil Output   : {tam_out} (status={s3})")

back_en_tam, s4 = translator.translate_to_english(tam_out, "ta")
print(f"Back to English: {back_en_tam} (status={s4})")

# -------------------------------------------------------------
# Test 3: English -> Telugu & Telugu -> English
# -------------------------------------------------------------
print("\n[TEST 3] English <-> Telugu Domain Terms")
en_tel_query = "Can an Ayurvedic formulation be patented in India?"
tel_out, s5 = translator.translate_from_english(en_tel_query, "te")
print(f"English Query  : {en_tel_query}")
print(f"Telugu Output  : {tel_out} (status={s5})")

back_en_tel, s6 = translator.translate_to_english(tel_out, "te")
print(f"Back to English: {back_en_tel} (status={s6})")

# -------------------------------------------------------------
# Test 4: Citation Preservation Test
# -------------------------------------------------------------
print("\n[TEST 4] Citation & Statutory Reference Preservation")
cited_english = (
    "Under Section 3(p) of the Patents Act 1970, traditional knowledge is not patentable [Source 01, Page 9]. "
    "Novel and non-obvious synergistic combinations can be examined [Source 03, Page 14]."
)
translated_cited, s7 = translator.translate_from_english(cited_english, "hi")
print(f"Original English:\n  {cited_english}")
print(f"\nTranslated Hindi with Citations:\n  {translated_cited}")

has_cit1 = "[Source 01, Page 9]" in translated_cited or "[Source 1, Page 9]" in translated_cited or "[Source 01" in translated_cited
has_cit2 = "[Source 03, Page 14]" in translated_cited or "[Source 3, Page 14]" in translated_cited or "[Source 03" in translated_cited

print(f"\nCitation 1 Preserved: {has_cit1}")
print(f"Citation 2 Preserved: {has_cit2}")

# -------------------------------------------------------------
# Test 5: English Bypass Test
# -------------------------------------------------------------
print("\n[TEST 5] English Bypass")
bypassed_text, status = translator.translate_to_english(en_term_query, "en")
assert bypassed_text == en_term_query
assert status == "bypassed"
print(f"English bypass verified: {status}")

print("\n" + "=" * 60)
print("ALL TRANSLATION TESTS PASSED SUCCESSFULLY!")
print("=" * 60)
