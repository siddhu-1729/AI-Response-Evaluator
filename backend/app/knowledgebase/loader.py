# dedicated for loading datasets

from datasets import load_dataset


class DatasetLoader:

    def load_squad(self):
        print("Loading SQuAD Dataset...")

        dataset = load_dataset("squad")

        print("Dataset Loaded Successfully!")

        return dataset