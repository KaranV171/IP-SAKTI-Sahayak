import requests


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen3:8b"

TIMEOUT = 300


def generate_answer(prompt: str) -> str:

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "think": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 350
            }
        },
        timeout=TIMEOUT
    )

    if response.status_code != 200:
        print("\nOllama Error:")
        print("Status:", response.status_code)
        print("Response:", response.text)

    response.raise_for_status()

    data = response.json()

    return data["response"]