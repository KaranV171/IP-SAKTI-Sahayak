import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.rag.llm import generate_answer


answer = generate_answer(
    "In one sentence, what is a patent?"
)

print("\n--- QWEN ANSWER ---")
print(answer)