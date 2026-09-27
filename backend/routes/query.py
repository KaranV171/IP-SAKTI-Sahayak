import logging
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel

from backend.database import get_connection
from backend.rag.rag_engine import RAGEngine
from backend.translation import (
    IndicTrans2Translator,
    is_english,
    normalize_language_code,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize RAG engine and IndicTrans2 translator singletons
rag_engine = RAGEngine()
translator = IndicTrans2Translator()


class QueryRequest(BaseModel):
    question: str
    top_k: int = 3
    language: Optional[str] = "en"


@router.post("/query")
def query(request: QueryRequest):
    lang = normalize_language_code(request.language)
    original_question = request.question.strip()
    logger.info(f"--> [QUERY START] lang={lang}, question='{original_question[:60]}...'")

    # ---------------------------------------------------------
    # 1. Translate Query to English if non-English
    # ---------------------------------------------------------
    query_translation_status = "bypassed"
    if is_english(lang):
        english_query = original_question
    else:
        logger.info(f"Translating query from {lang} to English...")
        english_query, query_translation_status = translator.translate_to_english(
            original_question,
            lang
        )
        logger.info(f"Translated query -> '{english_query}' (status: {query_translation_status})")

    # ---------------------------------------------------------
    # 2. Run existing RAG pipeline using English query
    # ---------------------------------------------------------
    logger.info(f"Executing RAG pipeline for English query: '{english_query}'")
    result = rag_engine.answer(
        query=english_query,
        top_k=request.top_k
    )
    logger.info("RAG pipeline finished.")

    # ---------------------------------------------------------
    # 3. Translate Grounded Answer to Target Language
    # ---------------------------------------------------------
    english_answer = result["answer"]
    translated_answer = english_answer
    answer_translation_status = "bypassed"

    if not is_english(lang):
        logger.info(f"Translating answer to {lang}...")
        translated_answer, answer_translation_status = translator.translate_from_english(
            english_answer,
            lang
        )
        logger.info(f"Answer translation status: {answer_translation_status}")

    # Overall translation status
    if query_translation_status == "failed" or answer_translation_status == "failed":
        overall_translation_status = "failed"
    elif query_translation_status == "success" or answer_translation_status == "success":
        overall_translation_status = "success"
    else:
        overall_translation_status = "bypassed"

    # ---------------------------------------------------------
    # 4. Save question and answer to canonical DB (English)
    # ---------------------------------------------------------
    logger.info("Persisting query to database...")
    question_id = None
    answer_id = None
    try:
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                # Save question
                cur.execute(
                    """
                    INSERT INTO questions (question)
                    VALUES (%s)
                    RETURNING id
                    """,
                    (english_query,)
                )

                question_id = cur.fetchone()[0]

                # Save answer
                cur.execute(
                    """
                    INSERT INTO answers
                    (
                        question_id,
                        answer,
                        confidence,
                        disclaimer,
                        model_name
                    )
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (
                        question_id,
                        english_answer,
                        result["confidence"],
                        result["disclaimer"],
                        "qwen3:8b"
                    )
                )

                answer_id = cur.fetchone()[0]

                conn.commit()

        finally:
            conn.close()
    except Exception as db_err:
        logger.warning(f"Database query persistence skipped or failed: {db_err}")

    # ---------------------------------------------------------
    # 5. Return backwards-compatible + multilingual response
    # ---------------------------------------------------------
    return {
        "question_id": question_id,
        "answer_id": answer_id,
        "query": english_query,
        "answer": english_answer,
        "original_question": original_question,
        "input_language": lang,
        "translated_query": english_query,
        "answer_language": lang,
        "translated_answer": translated_answer,
        "translation_status": overall_translation_status,
        "confidence": result["confidence"],
        "sources": result["sources"],
        "route": result["route"],
        "disclaimer": result["disclaimer"]
    }