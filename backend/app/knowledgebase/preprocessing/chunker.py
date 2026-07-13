# app/knowledge_base/preprocessing/chunker.py

from typing import List


class AdaptiveChunker:

    def __init__(
        self,
        chunk_size: int = 300,
        overlap: int = 50
    ):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks.

        If text is smaller than chunk_size,
        return it as a single chunk.
        """

        words = text.split()

        # No need to chunk
        if len(words) <= self.chunk_size:
            return [text]

        chunks = []

        start = 0

        while start < len(words):

            end = start + self.chunk_size

            chunk = " ".join(words[start:end])

            chunks.append(chunk)

            start += self.chunk_size - self.overlap

        return chunks