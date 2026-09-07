import os

import psycopg
from dotenv import load_dotenv


load_dotenv("infra/.env")


DATABASE_CONFIG = {
    "host": "127.0.0.1",
    "port": 5433,
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
}


def get_connection():
    return psycopg.connect(**DATABASE_CONFIG)