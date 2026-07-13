from app.knowledgebase.preprocessing.preprocessor import TextPreprocessor

preprocessor = TextPreprocessor()

text = """
      Java      was

      created     by James Gosling.
"""

clean_text = preprocessor.clean(text)

print(clean_text)