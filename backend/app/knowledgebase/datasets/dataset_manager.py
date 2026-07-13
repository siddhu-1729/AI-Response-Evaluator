# app/knowledge_base/datasets/dataset_manager.py

from app.knowledgebase.datasets.dataset_loader import DatasetLoader


class DatasetManager:

    def __init__(self):
        self.loader = DatasetLoader()

    def get_squad(self):
        return self.loader.load_squad()