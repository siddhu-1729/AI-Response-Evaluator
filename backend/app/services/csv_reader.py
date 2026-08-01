import csv
from io import StringIO
from fastapi import UploadFile


class CSVReader:

    @staticmethod
    async def read(file: UploadFile):

        content = await file.read()

        text = content.decode("utf-8")

        csv_file = StringIO(text)

        reader = csv.DictReader(csv_file)

        rows = []

        for row in reader:

            question = row.get("question", "").strip()
            response = row.get("response", "").strip()

            if not question or not response:
                continue

            rows.append({
                "question": question,
                "response": response
            })

        return rows