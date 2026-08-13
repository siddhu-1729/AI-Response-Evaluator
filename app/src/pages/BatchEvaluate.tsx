import { useState } from "react";
import axios from "axios";

import CSVUploader from "../components/CSVUploader";
import BatchSummary from "../components/BatchSummary";
import BatchTable from "../components/Batchtable";
import BatchDetailsModal from "../components/BatchDetailsModal";

import { useEvaluation } from "../context/EvaluationContext";

import type {
  BatchEvaluationResponse,
  BatchResult,
} from "../types/batch";

const BatchEvaluate = () => {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [batchResult, setBatchResult] =
    useState<BatchEvaluationResponse | null>(null);

  const [selectedResult, setSelectedResult] =
    useState<BatchResult | null>(null);

const { addEvaluation } = useEvaluation();

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post<BatchEvaluationResponse>(
        "http://localhost:8000/api/v1/batch-evaluations/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setBatchResult(response.data);
      setBatchResult(response.data);
// adding results to the context
response.data.results.forEach((item) => {
  addEvaluation({
    id: crypto.randomUUID(),
    question: item.question,
    response: item.response,
    evaluatedAt: new Date().toISOString(),
    result: item.evaluation,
  });
});
    } catch (error) {
      console.error(error);
      alert("Batch Evaluation Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <div className="mx-auto max-w-7xl">

        <CSVUploader
          file={file}
          loading={loading}
          onFileSelect={setFile}
          onUpload={handleUpload}
        />

        {loading && (

          <div className="mt-10 rounded-xl bg-slate-900 p-8 text-center">

            <h2 className="text-2xl font-bold text-violet-400">

              Evaluating CSV...

            </h2>

            <p className="mt-3 text-slate-400">

              Please wait while every AI response is evaluated.

            </p>

          </div>

        )}

        {batchResult && (

          <>

            <BatchSummary
              summary={batchResult.summary}
            />

            <BatchTable
              results={batchResult.results}
              onView={setSelectedResult}
            />

          </>

        )}

        <BatchDetailsModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />

      </div>

    </div>
  );
};

export default BatchEvaluate;