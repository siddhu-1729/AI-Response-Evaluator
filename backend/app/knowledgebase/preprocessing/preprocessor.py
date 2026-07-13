# app/knowledge_base/preprocessing/preprocessor.py

import re


class TextPreprocessor:

    def clean(self, text: str) -> str:
        """
        Clean and normalize text before chunking and embedding.
        """

        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text)

        # Remove leading/trailing spaces
        text = text.strip()

        return text