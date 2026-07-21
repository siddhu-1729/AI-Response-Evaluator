from app.engine.evaluation_engine import EvaluationEngine
from app.knowledgebase.datasets.dataset_manager import DatasetManager


def print_header(title: str):
    print("\n" + "=" * 100)
    print(title)
    print("=" * 100)


def print_case(
    case_name: str,
    expected_relevance: str,
    expected_accuracy: str,
    expected_hallucination: str,
    result
):

    print("\n" + "-" * 80)
    print(f"Validation Case : {case_name}")
    print("-" * 80)

    print("\nExpected Behaviour")

    print(f"Relevance      : {expected_relevance}")
    print(f"Accuracy       : {expected_accuracy}")
    print(f"Hallucination  : {expected_hallucination}")

    print("\nActual Results")

    print("\nRelevance")
    print(result.relevance)

    print("\nAccuracy")
    print(result.accuracy)

    print("\nHallucination")
    print(result.hallucination)

    print("-" * 80)


def get_validation_responses(reference_answer: str):

    return {

        "Correct Response": {
            "response": reference_answer,
            "expected_relevance": "HIGH",
            "expected_accuracy": "HIGH",
            "expected_hallucination": "LOW / NONE"
        },

        # "Partially Correct Response": {
        #     "response": reference_answer.split(",")[0],
        #     "expected_relevance": "HIGH",
        #     "expected_accuracy": "MEDIUM / HIGH",
        #     "expected_hallucination": "LOW"
        # },

        # "Incorrect Response": {
        #     "response": "This answer is intentionally incorrect for validation purposes.",
        #     "expected_relevance": "LOW",
        #     "expected_accuracy": "LOW",
        #     "expected_hallucination": "HIGH"
        # },

        # "Irrelevant Response": {
        #     "response": "Python is an interpreted programming language.",
        #     "expected_relevance": "LOW",
        #     "expected_accuracy": "LOW",
        #     "expected_hallucination": "OBSERVE"
        # }
    }


def main():

    dataset_manager = DatasetManager()

    dataset = dataset_manager.get_squad()

    train = dataset["train"]

    engine = EvaluationEngine()

    NUMBER_OF_SAMPLES = 5

    for sample_index in range(NUMBER_OF_SAMPLES):

        sample = train[sample_index]

        question = sample["question"]

        evidence = sample["context"]

        reference_answer = sample["answers"]["text"][0]

        print_header(f"SQuAD Sample {sample_index + 1}")

        print("\nQuestion")
        print(question)

        print("\nReference Answer")
        print(reference_answer)

        responses = get_validation_responses(reference_answer)

        for case_name, case in responses.items():

            response = case["response"]

            print("\nResponse")
            print(response)

            result = engine.evaluate(

                question=question,

                response=response,

                evidence=evidence
            )

            print_case(

                case_name,

                case["expected_relevance"],

                case["expected_accuracy"],

                case["expected_hallucination"],

                result
            )


if __name__ == "__main__":
    main()