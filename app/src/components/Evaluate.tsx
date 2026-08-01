// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { apiPost } from "../services/api";
// import { useEvaluation } from "../context/EvaluationContext";

// interface RelevanceResult {
//   score: number;
//   label: string;
//   confidence: number;
//   reason: string;
// }

// interface AccuracyResult {
//   score: number;
//   confidence: number;
//   supporting_evidence: string[];
//   reason: string;
// }

// interface HallucinatedClaim {
//   claim: string;
//   reason: string;
// }

// interface SupportedClaim {
//   claim: string;
// }

// interface HallucinationResult {
//   score: number;
//   confidence: number;
//   hallucinated_claims: HallucinatedClaim[];
//   supported_claims: SupportedClaim[];
//   reason: string;
// }

// interface CompletenessResult{
//    score:number;
//    confidence:number;
//    covered_aspects:string[];
//    missing_aspects:string[];
//    reason:string;
// }

// interface VerdictResult{
//   overall_score:number;
//   verdict:string;
//   strengths:string[];
//   weaknesses:string[];
//   recommendation:string;
// }

// export interface EvaluationResponse {
//   relevance: RelevanceResult;
//   accuracy: AccuracyResult;
//   hallucination: HallucinationResult;
//   completeness:CompletenessResult;
//   verdict:VerdictResult;
// }

// export const Evaluate = () => {

//   const [question, setQuestion] = useState("");

//   const [response, setResponse] = useState("");

//   const [isEvaluating, setIsEvaluating] = useState(false);

//   const [result, setResult] =
//     useState<EvaluationResponse | null>(null);

//   const { addEvaluation } = useEvaluation();

//   const isDisabled =
//     !question.trim() ||
//     !response.trim() ||
//     isEvaluating;
// //  Computed in backend as a verdict
//   // const calculateOverallScore = (
//   //   evaluation: EvaluationResponse
//   // ) => {

//   //   return (
//   //     (
//   //       evaluation.relevance.score +
//   //       evaluation.accuracy.score +
//   //       evaluation.hallucination.score+
//   //       evaluation.completeness.score
//   //   
//   //     ) / 4
//   //   ).toFixed(2);

//   // };

//   const handleEvaluate = async () => {

//     if (isDisabled) return;

//     setIsEvaluating(true);

//     try {

//       const evaluation =
//         await apiPost<EvaluationResponse>(
//           "/api/v1/evaluations",
//           {
//             question,
//             response,
//           }
//         );

//       setResult(evaluation);

//       addEvaluation({
//         id: crypto.randomUUID(),

//         question,

//         response,

//         evaluatedAt: new Date().toISOString(),

//         result: evaluation,
//       });

//     } catch (err) {

//       console.error(err);

//       alert("Evaluation Failed");

//     } finally {

//       setIsEvaluating(false);

//     }

//   };

//   return (

//    <div className="mx-auto max-w-5xl p-8">
//       <h1 className="text-3xl font-bold text-white mb-2">
//           AI Response Evaluator
//       </h1>
//       <p className="text-slate-400 mb-8">
//       Evaluate an AI response using RAG powered analysis.
//       </p>
//     <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-6">
//   <div>

//     <label className="block mb-2 text-slate-300">
//             Question   </label>
//     <textarea rows={3} value={question}  onChange={(e)=>setQuestion(e.target.value)}

//        className="w-full rounded-lg bg-slate-950 border border-slate-700 p-3 text-white"  placeholder="Enter your question..."/>

//       </div>

//       <div>

//           <label className="block mb-2 text-slate-300">

//                   AI Response
//           </label>
//       <textarea rows={8} value={response} onChange={(e)=>setResponse(e.target.value)}

//        className="w-full rounded-lg bg-slate-950 border border-slate-700 p-3 text-white" placeholder="Paste AI response..."/>

//       </div>

//       <button disabled={isDisabled} onClick={handleEvaluate}

//         className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 disabled:opacity-50">

//         {isEvaluating ? (
//               <>
//             <Loader2 className="animate-spin" size={18}/>

//         Evaluating...
//                     </>

//           ) : (

//             "Evaluate"   )}

//       </button>

//       {result && (

//         <div className="mt-10 space-y-6">

//           <div className="rounded-xl border border-violet-700 bg-slate-900 p-6">

//             <h2 className="text-2xl font-bold text-white mb-4">
//               Evaluation Result
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

//               <div className="rounded-lg bg-slate-800 p-4">

//                 <p className="text-slate-400 text-sm">
//                   Overall Score
//                 </p>

//                 <h3 className="text-4xl font-bold text-green-400 mt-2">
//                   {result.verdict.overall_score}
//                 </h3>

//               </div>

//               <div className="rounded-lg bg-slate-800 p-4">

//                 <p className="text-slate-400 text-sm">
//                   Relevance
//                 </p>

//                 <h3 className="text-4xl font-bold text-blue-400 mt-2">
//                   {result.relevance.score}
//                 </h3>

//                 <p className="text-xs mt-2 text-slate-400">
//                   {result.relevance.label}
//                 </p>

//               </div>

//               <div className="rounded-lg bg-slate-800 p-4">

//                 <p className="text-slate-400 text-sm">
//                   Accuracy
//                 </p>

//                 <h3 className="text-4xl font-bold text-yellow-400 mt-2">
//                   {result.accuracy.score}
//                 </h3>

//               </div>

//               <div className="rounded-lg bg-slate-800 p-4">

//                 <p className="text-slate-400 text-sm">
//                   Hallucination
//                 </p>

//                 <h3 className="text-4xl font-bold text-red-400 mt-2">
//                   {result.hallucination.score}
//                 </h3>

//               </div>
//               <div className="rounded-lg bg-slate-800 p-4">
//                  <p className="text-slate-400 text-sm">
//                      Completeness
//                  </p>

//                <h3 className="text-4xl font-bold text-emerald-400 mt-2">
//                    {result.completeness.score}
//                </h3>
//               </div>
//                  <div className="rounded-lg bg-slate-800 p-4">
//                            <p className="text-slate-400 text-sm">
//                                Verdict
//                             </p>

//                    <h3 className="text-2xl font-bold text-violet-400 mt-2">
//                      {result.verdict.verdict}
//                     </h3>
//                   </div>
//             </div>

//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//               <h2 className="text-lg font-semibold text-white mb-4">
//                 Relevance Analysis
//               </h2>

//               <p>

//                 <span className="font-semibold">
//                   Confidence:
//                 </span>

//                 {" "}
//                 {result.relevance.confidence}

//               </p>

//               <p className="mt-3 text-slate-300">

//                 {result.relevance.reason}

//               </p>

//             </div>

//             <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//               <h2 className="text-lg font-semibold text-white mb-4">
//                 Accuracy Analysis
//               </h2>

//               <p>

//                 <span className="font-semibold">
//                   Confidence:
//                 </span>

//                 {" "}
//                 {result.accuracy.confidence}

//               </p>

//               <p className="mt-3 text-slate-300">

//                 {result.accuracy.reason}

//               </p>

//             </div>

//             <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//                    <h2 className="text-lg font-semibold text-white mb-4">
//                       Completeness Analysis
//                     </h2>
//                   <p>
//                      <span className="font-semibold">
//                             Confidence:
//                        </span>{" "}
//                     {result.completeness.confidence}
//                   </p>

//                  <p className="mt-3 text-slate-300">
//                     {result.completeness.reason}
//                     </p>

//             </div>

//           </div>

//           <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//             <h2 className="text-xl font-semibold mb-4 text-white">

//               Supporting Evidence

//             </h2>

//             {

//               result.accuracy.supporting_evidence.length === 0 ?

//               (

//                 <p className="text-slate-500">

//                   No supporting evidence available.

//                 </p>

//               )

//               :

//               (

//                 <ul className="list-disc ml-6 space-y-2">

//                   {

//                     result.accuracy.supporting_evidence.map(

//                       (item,index)=>(

//                         <li key={index}>

//                           {item}

//                         </li>

//                       )

//                     )

//                   }

//                 </ul>

//               )

//             }

//           </div>

//           <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//     <h2 className="text-xl font-semibold mb-4 text-green-400">
//         Covered Aspects
//     </h2>

//     {
//         result.completeness.covered_aspects.length === 0 ?

//         (
//             <p className="text-slate-500">
//                 No covered aspects identified.
//             </p>
//         )

//         :

//         (
//             <ul className="list-disc ml-6 space-y-2">

//                 {
//                     result.completeness.covered_aspects.map(
//                         (item,index)=>(

//                             <li key={index}>
//                                 {item}
//                             </li>

//                         )
//                     )
//                 }

//             </ul>
//         )
//     }

// </div>
// <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//     <h2 className="text-xl font-semibold mb-4 text-red-400">
//         Missing Aspects
//     </h2>

//     {
//         result.completeness.missing_aspects.length === 0 ?

//         (
//             <p className="text-green-400">
//                 No important aspects are missing.
//             </p>
//         )

//         :

//         (
//             <ul className="list-disc ml-6 space-y-2">

//                 {
//                     result.completeness.missing_aspects.map(
//                         (item,index)=>(

//                             <li key={index}>
//                                 {item}
//                             </li>

//                         )
//                     )
//                 }

//             </ul>
//         )
//     }

// </div>

//           <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//             <h2 className="text-xl font-semibold mb-4 text-white">

//               Hallucination Analysis

//             </h2>

//             <p className="mb-5 text-slate-300">

//               {result.hallucination.reason}

//             </p>

//             {

//               result.hallucination.hallucinated_claims.length===0 ?

//               (

//                 <p className="text-green-400">

//                   No hallucinated claims detected.

//                 </p>

//               )

//               :

//               (

//                 <div className="space-y-4">

//                   {

//                     result.hallucination.hallucinated_claims.map(

//                       (claim,index)=>(

//                         <div

//                           key={index}

//                           className="rounded-lg border border-red-700 bg-red-900/20 p-4"

//                         >

//                           <p className="font-semibold text-red-300">

//                             {claim.claim}

//                           </p>

//                           <p className="text-sm text-slate-300 mt-2">

//                             {claim.reason}

//                           </p>

//                         </div>

//                       )

//                     )

//                   }

//                 </div>

//               )

//             }

//           </div>

//           {

//             result.hallucination.supported_claims.length>0 &&

//             (

//               <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//                 <h2 className="text-xl font-semibold mb-4 text-white">

//                   Supported Claims

//                 </h2>

//                 <ul className="list-disc ml-6 space-y-2">

//                   {

//                     result.hallucination.supported_claims.map(

//                       (claim,index)=>(

//                         <li key={index}>

//                           {claim.claim}

//                         </li>

//                       )

//                     )

//                   }

//                 </ul>

//               </div>

//             )

//           }



//           <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

//             <h2 className="text-2xl font-bold text-white mb-6">
//               Final Verdict
//             </h2>

//             <div className="space-y-6">

//               <div>
//                 <p className="text-slate-400 text-sm">Overall Verdict</p>
//                 <h3 className="text-3xl font-bold text-violet-400 mt-2">
//                   {result.verdict.verdict}
//                 </h3>
//                 <p className="text-slate-300 mt-2">
//                   Overall Score:
//                   <span className="font-semibold text-white">
//                     {" "}{result.verdict.overall_score}/10
//                   </span>
//                 </p>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-green-400 mb-2">Strengths</h3>
//                 <ul className="list-disc ml-6 space-y-2">
//                   {result.verdict.strengths.map((item,index)=>(
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-red-400 mb-2">Weaknesses</h3>
//                 <ul className="list-disc ml-6 space-y-2">
//                   {result.verdict.weaknesses.map((item,index)=>(
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-blue-400 mb-2">Recommendation</h3>
//                 <p className="text-slate-300">
//                   {result.verdict.recommendation}
//                 </p>
//               </div>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>

//   </div>

// );

// };