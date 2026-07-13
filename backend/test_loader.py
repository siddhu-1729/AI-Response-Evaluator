from app.knowledgebase.loader import DatasetLoader

loader = DatasetLoader()

dataset=loader.load_squad()

print(dataset["train"][0])