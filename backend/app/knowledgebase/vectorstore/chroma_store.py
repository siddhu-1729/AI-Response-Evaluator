import chromadb
from typing import List

class ChromaVectorStore:

    def __init__(
        self,
        collection_name: str = "knowledgebase"
    ):

        self.client = chromadb.PersistentClient(path="./chroma_db")

        self.collection = self.client.get_or_create_collection(
            name=collection_name
        )

        print(f"Collection '{collection_name}' ready.")

    #add all the data 
    def add_documents(
            
             self,
            ids: List[str],
            texts: List[str],
            embeddings: List[List[float]],
            metadata: List[dict]
        ):

         self.collection.add(

        ids=ids,

        documents=texts,

        embeddings=embeddings,

        metadatas=metadata
    )

    #Method to search the data  
    def search(
        self,
        embedding: List[float],
        top_k: int = 5
    ):

       return self.collection.query(

        query_embeddings=[embedding],

        n_results=top_k
    )

    def count(self):
        return self.collection.count()