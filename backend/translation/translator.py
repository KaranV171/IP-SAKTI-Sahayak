"""
High-Level Translation Service for IP-SAKTI Sahayak.

Provides clean, robust methods to translate user inquiries to English
for RAG processing and translate grounded English answers back to
the user's selected language with citation preservation and chunking
to respect the IndicTrans2 ONNX 256-token sequence limit.
"""

import re
import logging
from typing import Tuple, List

from backend.translation.languages import (
    get_indictrans_code,
    is_english,
    normalize_language_code,
)
from backend.translation.citation_guard import CitationGuard
from backend.translation.indictrans2 import IndicTrans2Engine

logger = logging.getLogger("ipsakti.translation")


class IndicTrans2Translator:
    """
    Service facade for multilingual translation in IP-SAKTI Sahayak.
    """

    def __init__(self):
        self.engine = IndicTrans2Engine.get_instance()
        self.citation_guard = CitationGuard()

    def translate_to_english(self, text: str, source_language: str) -> Tuple[str, str]:
        """
        Translates a user question from an Indian language to English.

        Returns:
            Tuple[translated_text, status]
            status can be 'success', 'bypassed', or 'failed'
        """
        if not text or not text.strip():
            return "", "bypassed"

        lang = normalize_language_code(source_language)

        # 1. English Bypass
        if is_english(lang):
            return text.strip(), "bypassed"

        indictrans_code = get_indictrans_code(lang)
        logger.info(f"Translating user query: {lang} ({indictrans_code}) -> English (eng_Latn)")

        try:
            # Queries are short sentences (usually < 200 chars)
            translated = self.engine.translate_indic_to_english(
                text=text.strip(),
                src_lang=indictrans_code
            )
            logger.info("Query translation completed successfully.")
            return translated.strip(), "success"

        except Exception as e:
            logger.error(f"Translation to English failed for language '{lang}': {e}", exc_info=True)
            return text.strip(), "failed"

    def translate_from_english(self, text: str, target_language: str) -> Tuple[str, str]:
        """
        Translates a grounded English RAG answer to the user's selected Indian language,
        safely preserving citations ([Source X, Page Y]), URLs, and disclaimer markers.
        Applies intelligent paragraph & sentence chunking so no chunk exceeds the ONNX
        256-token positional embedding boundary.

        Returns:
            Tuple[translated_text, status]
            status can be 'success', 'bypassed', or 'failed'
        """
        if not text or not text.strip():
            return "", "bypassed"

        lang = normalize_language_code(target_language)

        # 1. English Bypass
        if is_english(lang):
            return text.strip(), "bypassed"

        indictrans_code = get_indictrans_code(lang)
        logger.info(f"Translating answer: English (eng_Latn) -> {lang} ({indictrans_code}) with citation guard")

        try:
            # 2. Mask citations and URLs before neural translation
            masked_text, placeholder_map = self.citation_guard.mask(text)

            # 3. Translate chunk-by-chunk to respect ONNX positional embedding limits
            paragraphs = [p.strip() for p in masked_text.split("\n\n") if p.strip()]
            translated_paragraphs: List[str] = []

            for para in paragraphs:
                # Retain markdown dividers untouched
                if para.startswith("---") or para.startswith("==="):
                    translated_paragraphs.append(para)
                    continue

                if len(para) <= 240:
                    translated = self.engine.translate_english_to_indic(
                        text=para,
                        tgt_lang=indictrans_code
                    )
                    translated_paragraphs.append(translated)
                else:
                    # Break long paragraphs into sentence chunks
                    sentences = re.split(r"(?<=[.!?])\s+", para)
                    current_group = ""
                    group_translations: List[str] = []

                    for s in sentences:
                        s_clean = s.strip()
                        if not s_clean:
                            continue

                        if len(current_group) + len(s_clean) + 1 <= 240:
                            current_group = f"{current_group} {s_clean}".strip()
                        else:
                            if current_group:
                                group_translations.append(
                                    self.engine.translate_english_to_indic(
                                        text=current_group,
                                        tgt_lang=indictrans_code
                                    )
                                )
                            current_group = s_clean

                    if current_group:
                        group_translations.append(
                            self.engine.translate_english_to_indic(
                                text=current_group,
                                tgt_lang=indictrans_code
                            )
                        )

                    translated_paragraphs.append(" ".join(group_translations))

            raw_translation = "\n\n".join(translated_paragraphs)

            # 4. Restore exact citations and URLs
            restored_translation = self.citation_guard.restore(raw_translation, placeholder_map)

            logger.info("Answer translation completed successfully with citations preserved.")
            return restored_translation.strip(), "success"

        except Exception as e:
            logger.error(f"Answer translation failed for language '{lang}': {e}", exc_info=True)
            # If translation fails, return original English text so user still has guidance
            return text.strip(), "failed"
