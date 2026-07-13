# from app.knowledgebase.preprocessing.chunker import AdaptiveChunker


# chunker = AdaptiveChunker(
#     chunk_size=20,
#     overlap=5
# )

# text = """
# Java is a high-level object-oriented programming language developed by
# James Gosling at Sun Microsystems. It was released in 1995 and is
# widely used for enterprise applications, Android development, backend
# services, distributed systems, cloud computing, and many other
# software engineering domains.
# """

# chunks = chunker.chunk(text)

# print(f"Total Chunks : {len(chunks)}\n")

# for index, chunk in enumerate(chunks):

#     print("=" * 60)

#     print(f"Chunk {index + 1}")

#     print("=" * 60)

#     print(chunk)

#     print()

# let's test on real SQuAD dataset

from app.knowledgebase.datasets.dataset_manager import DatasetManager
from app.knowledgebase.preprocessing.preprocessor import TextPreprocessor
from app.knowledgebase.preprocessing.chunker import AdaptiveChunker


manager = DatasetManager()

dataset = manager.get_squad()

sample = dataset["train"][0]

context = sample["context"]

preprocessor = TextPreprocessor()

clean_context = preprocessor.clean(context)

chunker = AdaptiveChunker(
    chunk_size=300,
    overlap=50
)

chunks = chunker.chunk(clean_context)

print(f"Question : {sample['question']}")

print()

print(f"Total Chunks : {len(chunks)}")

print()

for i, chunk in enumerate(chunks):

    print("=" * 80)

    print(f"Chunk {i+1}")

    print("=" * 80)

    print(chunk)

    print()