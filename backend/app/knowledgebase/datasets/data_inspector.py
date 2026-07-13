# This tool will answer questions like:

# How many unique contexts are there?
# What's the average context length?
# What's the longest context?
# How many questions share the same context?

# These statistics will help us decide:

# Chunk size (300? 500? 1000 tokens?)
# Chunk overlap (50? 100?)
# Whether we even need chunking for SQuAD

from statistics import mean


class DatasetInspector:

    def inspect(self, dataset):

        train = dataset["train"]

        contexts = [sample["context"] for sample in train]

        unique_contexts = len(set(contexts))

        context_lengths = [len(c.split()) for c in contexts]

        print("=" * 60)
        print("DATASET ANALYSIS")
        print("=" * 60)

        print(f"Total Samples          : {len(train)}")
        print(f"Unique Contexts        : {unique_contexts}")
        print(f"Average Context Length : {mean(context_lengths):.2f} words")
        print(f"Shortest Context       : {min(context_lengths)} words")
        print(f"Longest Context        : {max(context_lengths)} words")