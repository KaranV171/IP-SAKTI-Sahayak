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