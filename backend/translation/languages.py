"""
Centralized Language Configuration for IP-SAKTI Sahayak.

Defines supported IndicTrans2 language codes, native script names,
and mapping helpers between user-facing codes (e.g., 'hi', 'ta')
and IndicTrans2 internal FLORES codes (e.g., 'hin_Deva', 'tam_Taml').
"""

from typing import Dict, List, Optional
from pydantic import BaseModel


class LanguageConfig(BaseModel):
    code: str              # Short code (e.g. 'en', 'hi', 'ta')
    indictrans_code: str   # FLORES-200 / IndicTrans2 code (e.g. 'hin_Deva')
    display_name: str      # English display name (e.g. 'Hindi')
    native_name: str       # Native script name (e.g. 'हिन्दी')
    script: str            # Script name (e.g. 'Devanagari')
    enabled: bool = True   # Whether enabled for SIH demo


# Canonical language definitions for IP-SAKTI Sahayak
SUPPORTED_LANGUAGES: List[LanguageConfig] = [
    LanguageConfig(
        code="en",
        indictrans_code="eng_Latn",
        display_name="English",
        native_name="English",
        script="Latin",
        enabled=True,
    ),
    LanguageConfig(
        code="hi",
        indictrans_code="hin_Deva",
        display_name="Hindi",
        native_name="हिन्दी",
        script="Devanagari",
        enabled=True,
    ),
    LanguageConfig(
        code="ta",
        indictrans_code="tam_Taml",
        display_name="Tamil",
        native_name="தமிழ்",
        script="Tamil",
        enabled=True,
    ),
    LanguageConfig(
        code="te",
        indictrans_code="tel_Telu",
        display_name="Telugu",
        native_name="తెలుగు",
        script="Telugu",
        enabled=True,
    ),
    LanguageConfig(
        code="bn",
        indictrans_code="ben_Beng",
        display_name="Bengali",
        native_name="বাংলা",
        script="Bengali",
        enabled=True,
    ),
    LanguageConfig(
        code="mr",
        indictrans_code="mar_Deva",
        display_name="Marathi",
        native_name="मराठी",
        script="Devanagari",
        enabled=True,
    ),
    LanguageConfig(
        code="gu",
        indictrans_code="guj_Gujr",
        display_name="Gujarati",
        native_name="ગુજરાતી",
        script="Gujarati",
        enabled=True,
    ),
    LanguageConfig(
        code="kn",
        indictrans_code="kan_Knda",
        display_name="Kannada",
        native_name="ಕನ್ನಡ",
        script="Kannada",
        enabled=True,
    ),
    LanguageConfig(
        code="ml",
        indictrans_code="mal_Mlym",
        display_name="Malayalam",
        native_name="മലയാളം",
        script="Malayalam",
        enabled=True,
    ),
    LanguageConfig(
        code="or",
        indictrans_code="ory_Orya",
        display_name="Odia",
        native_name="ଓଡ଼ିଆ",
        script="Odia",
        enabled=True,
    ),
    LanguageConfig(
        code="pa",
        indictrans_code="pan_Guru",
        display_name="Punjabi",
        native_name="ਪੰਜਾਬੀ",
        script="Gurmukhi",
        enabled=True,
    ),
    LanguageConfig(
        code="as",
        indictrans_code="asm_Beng",
        display_name="Assamese",
        native_name="অসমীয়া",
        script="Bengali-Assamese",
        enabled=True,
    ),
]

# Lookup tables for fast resolution
_CODE_TO_LANG: Dict[str, LanguageConfig] = {
    lang.code.lower(): lang for lang in SUPPORTED_LANGUAGES
}
_INDICTRANS_TO_LANG: Dict[str, LanguageConfig] = {
    lang.indictrans_code.lower(): lang for lang in SUPPORTED_LANGUAGES
}
_NAME_TO_LANG: Dict[str, LanguageConfig] = {
    lang.display_name.lower(): lang for lang in SUPPORTED_LANGUAGES
}


def normalize_language_code(query_lang: Optional[str]) -> str:
    """
    Normalizes any language string ('hi', 'hin_Deva', 'Hindi', 'hindi')
    into standard short code ('hi'). Defaults to 'en'.
    """
    if not query_lang or not query_lang.strip():
        return "en"

    cleaned = query_lang.strip().lower()

    if cleaned in _CODE_TO_LANG:
        return _CODE_TO_LANG[cleaned].code

    if cleaned in _INDICTRANS_TO_LANG:
        return _INDICTRANS_TO_LANG[cleaned].code

    if cleaned in _NAME_TO_LANG:
        return _NAME_TO_LANG[cleaned].code

    # Fallback to English if unknown
    return "en"


def get_indictrans_code(lang_code: str) -> str:
    """
    Returns the IndicTrans2 FLORES code for a given language code.
    Example: 'hi' -> 'hin_Deva', 'ta' -> 'tam_Taml'.
    """
    normalized = normalize_language_code(lang_code)
    cfg = _CODE_TO_LANG.get(normalized)
    return cfg.indictrans_code if cfg else "eng_Latn"


def is_english(lang_code: str) -> bool:
    """Returns True if the language is English."""
    normalized = normalize_language_code(lang_code)
    return normalized == "en"


def get_supported_languages() -> List[dict]:
    """Returns the list of active supported languages for API responses."""
    return [
        {
            "code": l.code,
            "indictrans_code": l.indictrans_code,
            "display_name": l.display_name,
            "native_name": l.native_name,
            "script": l.script,
            "enabled": l.enabled,
        }
        for l in SUPPORTED_LANGUAGES
        if l.enabled
    ]
