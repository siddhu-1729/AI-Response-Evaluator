from typing import List

from app.knowledgebase.embeddings.embedder import Embedder
from app.knowledgebase.vectorstore.chroma_store import ChromaVectorStore


class Retriever:

    def __init__(
        self,
        vector_store: ChromaVectorStore,
        embedder: Embedder
    ):
        self.vector_store = vector_store
        self.embedder = embedder

    def retrieve(
        self,
        question: str,
        top_k: int = 5
    ) -> List[str]:

        # Step 1: Generate embedding for the question
        question_embedding = self.embedder.embed(question)

        # Step 2: Search the vector database
        results = self.vector_store.search(
            embedding=question_embedding,
            top_k=top_k
        )

        # Step 3: Extract retrieved documents
        documents = results.get("documents", [])

        if not documents:
            return []

        return documents[0]