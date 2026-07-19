from app.evaluation.agents.accuracy_agent import AccuracyAgent

agent = AccuracyAgent()

result = agent.evaluate(
    question="Who invented Java?",
    reference="Java was created by James Gosling in 1995.",
    response="Java is an Object oriented programming language."
)

print(result)