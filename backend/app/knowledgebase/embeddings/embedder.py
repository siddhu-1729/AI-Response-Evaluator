# app/knowledge_base/embeddings/embedder.py

from typing import List

from sentence_transformers import SentenceTransformer


class Embedder:

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2"
    ):

        print(f"Loading Embedding Model : {model_name}")

        self.model = SentenceTransformer(model_name)

        print("Embedding Model Loaded Successfully!")

    def embed(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        """

        embedding = self.model.encode(
            text,
            convert_to_numpy=True
        )

        return embedding.tolist()

    def embed_batch(
        self,
        texts: List[str]
    ) -> List[List[float]]:
        """
        Generate embeddings for multiple texts.
        """

        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True
        )

        return embeddings.tolist()