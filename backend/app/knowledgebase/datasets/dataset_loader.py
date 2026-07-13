# app/knowledge_base/datasets/dataset_loader.py

from datasets import load_dataset


class DatasetLoader:

    def load_squad(self):
        """
        Load the SQuAD dataset from Hugging Face.
        """

        print("Loading SQuAD dataset...")

        dataset = load_dataset("squad")

        print("SQuAD loaded successfully.")

        return dataset