"""
IndicTrans2 ONNX Engine Singleton for IP-SAKTI Sahayak.

Manages bidirectional distilled 200M models:
- Indic -> English: hari31416/indictrans2-indic-en-dist-200M-ONNX
- English -> Indic: hari31416/indictrans2-en-indic-dist-200M-ONNX

Features:
- Lazy loading (models load on first non-English request)
- Thread-safe singleton
- Negligible VRAM footprint (~250-350MB)
- Script normalization and transliteration via IndicProcessor
"""

import os
import sys
import logging
import threading
from typing import Optional

# ---------------------------------------------------------------------------
# Transformers 5.x Compatibility Shim for IndicTransToolkit
# ---------------------------------------------------------------------------
try:
    import transformers.tokenization_utils as tu
    import transformers.tokenization_utils_base as tub
    if not hasattr(tu, "PreTrainedTokenizerBase"):
        tu.PreTrainedTokenizerBase = tub.PreTrainedTokenizerBase
except Exception as e:
    pass

from huggingface_hub import hf_hub_download
import importlib.util

logger = logging.getLogger("ipsakti.translation")
logger.setLevel(logging.INFO)


class IndicTrans2Engine:
    """
    Thread-safe singleton engine managing IndicTrans2 ONNX models.
    """
    _instance: Optional["IndicTrans2Engine"] = None
    _lock = threading.Lock()

    def __init__(self):
        self._indic_to_en_model = None
        self._en_to_indic_model = None
        self._load_lock = threading.Lock()
        self._initialized = False

    @classmethod
    def get_instance(cls) -> "IndicTrans2Engine":
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls()
            return cls._instance

    def _ensure_indic_to_en(self):
        """Loads Indic -> English model if not already resident."""
        if self._indic_to_en_model is not None:
            return self._indic_to_en_model

        with self._load_lock:
            if self._indic_to_en_model is None:
                repo_id = "hari31416/indictrans2-indic-en-dist-200M-ONNX"
                logger.info(f"Loading IndicTrans2 Indic->English model from {repo_id}...")
                translate_py = hf_hub_download(repo_id, "translate.py")
                spec = importlib.util.spec_from_file_location("indic_to_en_onnx", translate_py)
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                self._indic_to_en_model = mod.IndicTransONNX(repo_id)
                logger.info("IndicTrans2 Indic->English model loaded successfully.")
            return self._indic_to_en_model

    def _ensure_en_to_indic(self):
        """Loads English -> Indic model if not already resident."""
        if self._en_to_indic_model is not None:
            return self._en_to_indic_model

        with self._load_lock:
            if self._en_to_indic_model is None:
                repo_id = "hari31416/indictrans2-en-indic-dist-200M-ONNX"
                logger.info(f"Loading IndicTrans2 English->Indic model from {repo_id}...")
                translate_py = hf_hub_download(repo_id, "translate.py")
                spec = importlib.util.spec_from_file_location("en_to_indic_onnx", translate_py)
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                self._en_to_indic_model = mod.IndicTransONNX(repo_id)
                logger.info("IndicTrans2 English->Indic model loaded successfully.")
            return self._en_to_indic_model

    def translate_indic_to_english(self, text: str, src_lang: str) -> str:
        """
        Translates text from an Indian language to English.
        Example: src_lang='hin_Deva' -> 'eng_Latn'.
        """
        if not text or not text.strip():
            return ""

        model = self._ensure_indic_to_en()
        return model.translate(text.strip(), src_lang=src_lang, tgt_lang="eng_Latn")

    def translate_english_to_indic(self, text: str, tgt_lang: str) -> str:
        """
        Translates text from English to an Indian language.
        Example: tgt_lang='hin_Deva'.
        """
        if not text or not text.strip():
            return ""

        model = self._ensure_en_to_indic()
        return model.translate(text.strip(), src_lang="eng_Latn", tgt_lang=tgt_lang)
