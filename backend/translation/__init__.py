"""
Translation module for IP-SAKTI Sahayak.
"""

from backend.translation.languages import (
    SUPPORTED_LANGUAGES,
    LanguageConfig,
    get_indictrans_code,
    get_supported_languages,
    is_english,
    normalize_language_code,
)
from backend.translation.citation_guard import CitationGuard
from backend.translation.indictrans2 import IndicTrans2Engine
from backend.translation.translator import IndicTrans2Translator

__all__ = [
    "SUPPORTED_LANGUAGES",
    "LanguageConfig",
    "get_indictrans_code",
    "get_supported_languages",
    "is_english",
    "normalize_language_code",
    "CitationGuard",
    "IndicTrans2Engine",
    "IndicTrans2Translator",
]
