# app/knowledge_base/pipeline.py

from app.knowledgebase.datasets.dataset_manager import DatasetManager
from app.knowledgebase.preprocessing.preprocessor import TextPreprocessor
from app.knowledgebase.preprocessing.chunker import AdaptiveChunker
from app.knowledgebase.embeddings.embedder import Embedder
from app.knowledgebase.vectorstore.chroma_store import ChromaVectorStore


class KnowledgeBasePipeline:

    def __init__(self):

        self.dataset_manager = DatasetManager()

        self.preprocessor = TextPreprocessor()

        self.chunker = AdaptiveChunker()

        self.embedder = Embedder()

        self.vector_store = ChromaVectorStore()
    
    # Build method that automates the whole process (from loading dataset-->extracting unique constraints-->processing-->embedding-->storing into chromaDB)
    # def build(self):
     

    #  dataset = self.dataset_manager.get_squad()

    #  train = dataset["train"]

    #  contexts = list(
    #       set(
    #         sample["context"]
    #          for sample in train
    #      )
    #  )

    #  print(f"Unique Contexts : {len(contexts)}")

    #  document_id = 0

    #  for context in contexts:

    #     clean_text = self.preprocessor.clean(context)

    #     chunks = self.chunker.chunk(clean_text)

    #     for chunk in chunks:

    #         embedding = self.embedder.embed(chunk)

    #         self.vector_store.add_documents(

    #             ids=[str(document_id)],

    #             texts=[chunk],

    #             embeddings=[embedding],

    #             metadata=[
    #                 {
    #                     "dataset": "SQuAD"
    #                 }
    #             ]
    #         )

    #         document_id += 1

    # print("Knowledge Base Built Successfully!")
    def build(self, limit: int | None = None):

     dataset = self.dataset_manager.get_squad()

     train = dataset["train"]

     contexts = list(
        set(sample["context"] for sample in train)
     )

     if limit is not None:
        contexts = contexts[:limit]

        print(f"Processing {len(contexts)} contexts...")

     document_id = 0

     for context in contexts:

        clean_text = self.preprocessor.clean(context)

        chunks = self.chunker.chunk(clean_text)

        for chunk in chunks:

            embedding = self.embedder.embed(chunk)

            self.vector_store.add_documents(
                ids=[str(document_id)],
                texts=[chunk],
                embeddings=[embedding],
                metadata=[{"dataset": "SQuAD"}]
            )

            document_id += 1

    print("Knowledge Base Built Successfully!")