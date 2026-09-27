from fastapi import FastAPI

from backend.database import get_connection
from backend.routes.query import router as query_router


app = FastAPI(
    title="IP-SAKTI Sahayak",
    description="Multilingual RAG Assistant for IPR & Regulatory Guidance in Ayurveda",
    version="0.1.0"
)


# Register API routes
app.include_router(query_router, prefix="/api")

from backend.translation import (
    IndicTrans2Translator,
    get_supported_languages,
    is_english,
    normalize_language_code,
)
from pydantic import BaseModel
from typing import Optional

translator = IndicTrans2Translator()


class TranslateRequest(BaseModel):
    text: str
    target_language: str
    source_language: Optional[str] = "en"


@app.post("/api/translate")
def translate_endpoint(req: TranslateRequest):
    src = normalize_language_code(req.source_language or "en")
    tgt = normalize_language_code(req.target_language)

    if src == tgt:
        return {
            "translated_text": req.text,
            "status": "bypassed",
            "target_language": tgt
        }

    if is_english(src):
        translated, status = translator.translate_from_english(req.text, tgt)
        return {
            "translated_text": translated,
            "status": status,
            "target_language": tgt
        }
    elif is_english(tgt):
        translated, status = translator.translate_to_english(req.text, src)
        return {
            "translated_text": translated,
            "status": status,
            "target_language": tgt
        }
    else:
        en_text, s1 = translator.translate_to_english(req.text, src)
        translated, s2 = translator.translate_from_english(en_text, tgt)
        return {
            "translated_text": translated,
            "status": "success" if (s1 == "success" and s2 == "success") else "partial",
            "target_language": tgt
        }


@app.get("/api/languages")
def list_languages():
    return {
        "status": "ok",
        "languages": get_supported_languages()
    }


@app.get("/")
def root():
    return {
        "message": "IP-SAKTI Sahayak API is running",
        "status": "ok"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/health/database")
def database_health():
    try:
        conn = get_connection()

        with conn.cursor() as cur:
            cur.execute("SELECT current_database(), version()")
            result = cur.fetchone()

        conn.close()

        return {
            "status": "healthy",
            "database": result[0],
            "postgresql": result[1]
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }