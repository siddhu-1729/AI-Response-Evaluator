from app.evaluation.agents.completeness_agent import CompletenessAgent

agent = CompletenessAgent()

result = agent.evaluate(

    question="Explain polymorphism in Java.",

    response="""
Polymorphism allows objects to behave differently using method overriding.
""",

    evidence="""
Polymorphism is an OOP concept.

There are two types:

Runtime polymorphism.

Compile-time polymorphism.

Runtime polymorphism uses method overriding.

Compile-time polymorphism uses method overloading.

Advantages include flexibility and extensibility.
"""
)

print(result.model_dump_json(indent=4))