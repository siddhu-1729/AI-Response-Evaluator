import { useRef } from "react";

interface CSVUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  loading: boolean;
  onUpload: () => void;
}

const CSVUploader = ({
  file,
  onFileSelect,
  loading,
  onUpload,
}: CSVUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">

      <h2 className="text-2xl font-bold text-white mb-2">
        Batch Evaluation
      </h2>

      <p className="text-slate-400 mb-6">
        Upload a CSV file containing question-response pairs.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col gap-4 md:flex-row">

        <button
          type="button"
          onClick={openFilePicker}
          className="rounded-lg bg-slate-700 px-5 py-3 text-white hover:bg-slate-600 transition"
        >
          Choose CSV
        </button>

        <button
          type="button"
          disabled={!file || loading}
          onClick={onUpload}
          className={`rounded-lg px-5 py-3 text-white transition ${
            !file || loading
              ? "cursor-not-allowed bg-slate-600"
              : "bg-violet-600 hover:bg-violet-700"
          }`}
        >
          {loading ? "Evaluating..." : "Evaluate Batch"}
        </button>

      </div>

      {file && (
        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800 p-4">

          <p className="text-sm text-slate-300">
            <span className="font-semibold">Selected File:</span>{" "}
            {file.name}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {(file.size / 1024).toFixed(2)} KB
          </p>

        </div>
      )}

    </div>
  );
};

export default CSVUploader;