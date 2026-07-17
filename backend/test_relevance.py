from app.evaluation.agents.relevance_agent import RelevanceAgent



agent = RelevanceAgent()

# result = agent.evaluate(
#     question="What is polymorphism?",
#     response="""
# Polymorphism is an object-oriented programming concept
# that allows one object to take multiple forms.
# """
# )
result=agent.evaluate(
    question="What is polymorphism?",
    response="Java was invented by james Gosling"
)
print(result)