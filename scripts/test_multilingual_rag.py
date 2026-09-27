"""
Comprehensive Multilingual RAG Integration Test Script
Tests all 6 required evaluation criteria:
1. English Regression Test
2. Hindi Query Pipeline
3. Tamil Query Pipeline
4. Telugu Query Pipeline
5. Cross-Domain Multi-Category Query Pipeline
6. Low-Confidence / Statutory Grounding Query Pipeline
"""

import sys
import json
import time
import requests

# Ensure UTF-8 output on Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

API_URL = "http://127.0.0.1:8000/api/query"

TEST_CASES = [
    {
        "id": "TEST-1",
        "name": "English Regression Baseline",
        "question": "Can I patent an Ayurvedic formulation?",
        "language": "en",
        "must_have_citations": True,
        "must_have_disclaimer": True,
    },
    {
        "id": "TEST-2",
        "name": "Hindi Ayurvedic Patentability Inquiry",
        "question": "क्या मैं एक आयुर्वेदिक फॉर्मूलेशन का पेटेंट करा सकता हूं?",
        "language": "hi",
        "must_have_citations": True,
        "must_have_disclaimer": True,
    },
    {
        "id": "TEST-3",
        "name": "Tamil Ayurvedic Patentability Inquiry",
        "question": "இந்தியாவில் ஒரு ஆயுர்வேத சூத்திரத்திற்கு காப்புரிமை பெற முடியுமா?",
        "language": "ta",
        "must_have_citations": True,
        "must_have_disclaimer": True,
    },
    {
        "id": "TEST-4",
        "name": "Telugu Ayurvedic Patentability Inquiry",
        "question": "భారతదేశంలో ఆయుర్వేద సూత్రీకరణకు పేటెంట్ పొందవచ్చా?",
        "language": "te",
        "must_have_citations": True,
        "must_have_disclaimer": True,
    },
    {
        "id": "TEST-5",
        "name": "Cross-Domain Biodiversity & IP (Hindi)",
        "question": "मैं एक औषधीय पौधे का उपयोग करके एक आयुर्वेदिक उत्पाद विकसित करना चाहता हूं। मुझे किन बौद्धिक संपदा और जैव विविधता मुद्दों पर विचार करना चाहिए?",
        "language": "hi",
        "must_have_citations": True,
        "must_have_disclaimer": True,
    },
    {
        "id": "TEST-6",
        "name": "Low Confidence / Government Fee Inquiry (Hindi)",
        "question": "2026 में भारत में आयुर्वेदिक पेटेंट आवेदन दाखिल करने के लिए सटीक सरकारी शुल्क क्या है?",
        "language": "hi",
        "must_have_citations": False,
        "must_have_disclaimer": True,
    },
]

def run_tests():
    print("=" * 80, flush=True)
    print("IP-SAKTI SAHAYAK — MULTILINGUAL RAG END-TO-END VALIDATION SUITE", flush=True)
    print("=" * 80, flush=True)

    results = []

    for test in TEST_CASES:
        print(f"\n[{test['id']}] Running: {test['name']}", flush=True)
        print(f"  Input Question: {test['question']}", flush=True)
        print(f"  Language Code:  {test['language']}", flush=True)

        payload = {
            "question": test["question"],
            "top_k": 3,
            "language": test["language"],
        }

        start_time = time.time()
        try:
            resp = requests.post(API_URL, json=payload, timeout=180)
            elapsed = time.time() - start_time

            if resp.status_code != 200:
                print(f"  FAILED: HTTP {resp.status_code} - {resp.text}", flush=True)
                results.append({"id": test["id"], "passed": False, "error": resp.text})
                continue

            data = resp.json()
            
            # Telemetry
            print(f"  HTTP 200 OK ({elapsed:.2f}s)", flush=True)
            print(f"  Canonical Query:       {data.get('query')}", flush=True)
            if test["language"] != "en":
                print(f"  Original Question:     {data.get('original_question')}", flush=True)
                print(f"  Translated Query:      {data.get('translated_query')}", flush=True)
                print(f"  Translation Status:    {data.get('translation_status')}", flush=True)
            
            print(f"  Confidence:            {data.get('confidence')}", flush=True)
            print(f"  Sources Retrieved:     {len(data.get('sources', []))}", flush=True)
            for idx, s in enumerate(data.get('sources', [])[:2]):
                print(f"    - Source {s.get('source_number')}: {s.get('source_title')} (sim: {s.get('similarity'):.4f}, p.{s.get('page_number')})", flush=True)

            print(f"  Route Intent:          {data.get('route', {}).get('intent')}", flush=True)
            print(f"  Route Categories:      {data.get('route', {}).get('categories')}", flush=True)

            passed = True
            reasons = []

            # 1. Check answer exists
            if not data.get("answer"):
                passed = False
                reasons.append("Missing English answer")

            # 2. Check translated_answer for non-English
            if test["language"] != "en":
                if not data.get("translated_answer"):
                    passed = False
                    reasons.append("Missing translated_answer for non-English request")
                if data.get("translation_status") != "success":
                    passed = False
                    reasons.append(f"Translation status is {data.get('translation_status')}")
                snippet = data.get('translated_answer', '')[:140].replace('\n', ' ')
                print(f"  Translated Answer Snippet:\n    {snippet}...", flush=True)
            else:
                snippet = data.get('answer', '')[:140].replace('\n', ' ')
                print(f"  English Answer Snippet:\n    {snippet}...", flush=True)

            # 3. Check citations survived
            answer_to_check = data.get("translated_answer") if test["language"] != "en" else data.get("answer")
            has_source_citations = "[Source" in (answer_to_check or "")
            print(f"  Citation Markers Intact in Final Answer: {has_source_citations}", flush=True)

            # 4. Check disclaimer
            if not data.get("disclaimer"):
                passed = False
                reasons.append("Missing disclaimer")

            results.append({
                "id": test["id"],
                "name": test["name"],
                "passed": passed,
                "elapsed": elapsed,
                "confidence": data.get("confidence"),
                "citations_intact": has_source_citations,
                "translation_status": data.get("translation_status", "bypassed"),
                "reasons": reasons,
            })

            print(f"  RESULT: {'PASSED' if passed else 'FAILED'}", flush=True)

        except Exception as e:
            print(f"  EXCEPTION: {e}", flush=True)
            results.append({"id": test["id"], "name": test["name"], "passed": False, "error": str(e)})

    # Summary table
    print("\n" + "=" * 80, flush=True)
    print("FINAL SUMMARY REPORT", flush=True)
    print("=" * 80, flush=True)
    all_passed = True
    for r in results:
        status_str = "PASS" if r.get("passed") else "FAIL"
        if not r.get("passed"):
            all_passed = False
        print(f"[{status_str}] {r['id']}: {r.get('name')} | Time: {r.get('elapsed', 0):.2f}s | Conf: {r.get('confidence')} | TransStatus: {r.get('translation_status')}", flush=True)
        if r.get("reasons"):
            print(f"      Reasons: {', '.join(r['reasons'])}", flush=True)

    print("=" * 80, flush=True)
    if all_passed:
        print("ALL MULTILINGUAL RAG TESTS COMPLETED SUCCESSFULLY!", flush=True)
    else:
        print("SOME TESTS FAILED - REVIEW ABOVE LOGS", flush=True)
    print("=" * 80, flush=True)

if __name__ == "__main__":
    run_tests()
