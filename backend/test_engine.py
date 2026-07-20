from app.engine.evaluation_engine import EvaluationEngine

engine = EvaluationEngine()

result = engine.evaluate(

    question="Who invented Java?",

    response="Java was created by James Gosling in 1998.",

    evidence="Java was created by James Gosling in 1995."
)

print(result.model_dump_json(indent=4))