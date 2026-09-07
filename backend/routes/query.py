from fastapi import APIRouter
from pydantic import BaseModel

from backend.database import get_connection
from backend.rag.rag_engine import RAGEngine


router = APIRouter()

# Initialize RAG engine once when the API starts
rag_engine = RAGEngine()


class QueryRequest(BaseModel):
    question: str
    top_k: int = 3


@router.post("/query")
def query(request: QueryRequest):

    # ---------------------------------------------------------
    # 1. Run RAG pipeline
    # ---------------------------------------------------------
    result = rag_engine.answer(
        query=request.question,
        top_k=request.top_k
    )

    # ---------------------------------------------------------
    # 2. Save question and answer
    # ---------------------------------------------------------
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
                (request.question,)
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
                    result["answer"],
                    result["confidence"],
                    result["disclaimer"],
                    "qwen3:8b"
                )
            )

            answer_id = cur.fetchone()[0]

            conn.commit()

    finally:
        conn.close()

    # ---------------------------------------------------------
    # 3. Return API response
    # ---------------------------------------------------------
    return {
        "question_id": question_id,
        "answer_id": answer_id,
        "query": result["query"],
        "answer": result["answer"],
        "confidence": result["confidence"],
        "sources": result["sources"],
        "route": result["route"],
        "disclaimer": result["disclaimer"]
    }