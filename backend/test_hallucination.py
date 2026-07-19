from app.evaluation.agents.hallucination_agent import HallucinationAgent

agent = HallucinationAgent()

result = agent.evaluate(

    question="Who invented Java?",

    evidence="""
Java was created by James Gosling in 1995.
""",

    response="""
Java was created by James Gosling in 1998.
"""
)

print(result)