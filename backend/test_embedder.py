from app.knowledgebase.embeddings.embedder import Embedder

embedder = Embedder()

# text = "Java was developed by James Gosling."

# embedding = embedder.embed(text)

# print()

# print(f"Embedding Dimension : {len(embedding)}")

# print()

# print(embedding[:15])

texts = [
    "Java was created by James Gosling.",
    "Python was created by Guido van Rossum.",
    "C++ was developed by Bjarne Stroustrup."
]

vectors = embedder.embed_batch(texts)

print(len(vectors))

print(len(vectors[0]))