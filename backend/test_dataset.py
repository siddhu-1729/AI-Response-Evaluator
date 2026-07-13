from app.knowledgebase.datasets.dataset_manager import DatasetManager
from app.knowledgebase.datasets.data_inspector import DatasetInspector

manager = DatasetManager()

dataset = manager.get_squad()

insepctor=DatasetInspector()
insepctor.inspect(dataset)

# print(dataset)

# print("\nFirst Sample:\n")

# print(dataset["train"][0])
# sample=dataset["train"][0]

# print("\n keys:")
# print(sample.keys())
