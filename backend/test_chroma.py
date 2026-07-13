from app.knowledgebase.embeddings.embedder import Embedder
from app.knowledgebase.vectorstore.chroma_store import ChromaVectorStore

embedder = Embedder()

store = ChromaVectorStore()

# text = "Java was created by James Gosling."

# embedding = embedder.embed(text)

# store.add_documents(

#     ids=["1"],

#     texts=[text],

#     embeddings=[embedding],

#     metadata=[
#         {
#             "dataset": "demo"
#         }
#     ]
# )

# print(store.count())


query = "Who invented Java?"

query_embedding = embedder.embed(query)

results = store.search(query_embedding)

print(results)