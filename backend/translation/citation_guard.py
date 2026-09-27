"""
Citation and Metadata Preservation Guard for IP-SAKTI Sahayak.

Ensures that structured citations (e.g. '[Source 1, Page 9]', '[Source 2]'),
URLs, and sensitive statutory identifiers are not mutated, translated,
or dropped by IndicTrans2 during neural translation.

Uses standard reference index markers (e.g., '[901]', '[902]') which
are preserved by neural sequence-to-sequence translation models.
"""

import re
from typing import Dict, List, Tuple


class CitationGuard:
    """
    Guards citation references and technical identifiers before translation
    and restores them accurately after translation.
    """

    # Matches '[Source 1, Page 9]', '[Source 01, p.9]', '[Source 2]', etc.
    CITATION_REGEX = re.compile(
        r"\[Source\s+\d+(?:,\s*(?:Page|p\.)\s*\d+)?\]",
        re.IGNORECASE
    )

    # Matches standard web URLs
    URL_REGEX = re.compile(
        r"https?://[^\s\)]+",
        re.IGNORECASE
    )

    def mask(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Replaces citations and URLs with protected numeric reference markers
        (e.g., [901], [902]) which are reliably preserved by IndicTrans2.
        """
        if not text:
            return text, {}

        placeholder_map: Dict[str, str] = {}
        masked_text = text

        # 1. Mask URLs first to prevent accidental regex intersection
        urls = self.URL_REGEX.findall(masked_text)
        for i, url in enumerate(urls):
            ph = f"[80{i+1}]"
            placeholder_map[ph] = url
            masked_text = masked_text.replace(url, ph, 1)

        # 2. Mask citations [Source X, Page Y]
        citations = self.CITATION_REGEX.findall(masked_text)
        for i, cit in enumerate(citations):
            ph = f"[{901 + i}]"
            placeholder_map[ph] = cit
            masked_text = masked_text.replace(cit, ph, 1)

        return masked_text, placeholder_map

    def restore(self, translated_text: str, placeholder_map: Dict[str, str]) -> str:
        """
        Restores original citations and URLs from numeric placeholders in translated text.
        Handles possible spacing variations introduced by tokenizers (e.g. '[ 901 ]' or '[901]').
        """
        if not translated_text or not placeholder_map:
            return translated_text

        restored = translated_text

        for ph, original in placeholder_map.items():
            num = ph.strip("[]")
            # Flexible pattern matching [901] or [ 901 ]
            flexible_pattern = re.compile(rf"\[\s*{num}\s*\]")
            restored = flexible_pattern.sub(original, restored)
            restored = restored.replace(ph, original)

        # Clean up any duplicated spaces before citations
        restored = re.sub(r"\s+(\[Source\s+\d+)", r" \1", restored)

        return restored
