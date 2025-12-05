"use client";

import { AIAnalysisResult } from "@/lib/types";

interface Props {
  result: AIAnalysisResult;
}

export default function AnalysisResult({ result }: Props) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-600";
    if (score < 80) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Analysis Results</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Risk Level</p>
          <p
            className={`text-lg font-bold uppercase px-3 py-1 rounded-full inline-block ${getRiskColor(
              result.risk_level
            )}`}
          >
            {result.risk_level}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Patient Safety Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(result.safety_score)}`}>
            {result.safety_score}
            <span className="text-base">/100</span>
          </p>
        </div>
      </div>

      {/* Clinician Summary */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Clinician Summary</h3>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{result.summary}</p>
      </div>

      {/* Flagged Issues */}
      <div>
        <h3 className="font-semibold text-lg mb-2 text-red-600">Flagged Issues</h3>
        <div className="space-y-3">
          {result.flagged_issues.drug_interactions.length > 0 && (
            <div>
              <h4 className="font-medium">Drug-Drug Interactions</h4>
              <ul className="list-disc list-inside text-gray-600 pl-2">
                {result.flagged_issues.drug_interactions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {result.flagged_issues.contraindications.length > 0 && (
            <div>
              <h4 className="font-medium">Contraindications</h4>
              <ul className="list-disc list-inside text-gray-600 pl-2">
                {result.flagged_issues.contraindications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {result.flagged_issues.warnings.length > 0 && (
            <div>
              <h4 className="font-medium">Warnings</h4>
              <ul className="list-disc list-inside text-gray-600 pl-2">
                {result.flagged_issues.warnings.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {result.flagged_issues.drug_interactions.length === 0 &&
            result.flagged_issues.contraindications.length === 0 &&
            result.flagged_issues.warnings.length === 0 && (
              <p className="text-gray-500 text-sm">No critical issues flagged.</p>
            )}
        </div>
      </div>

      {/* Treatment Plan */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Suggested Treatment Plan</h3>
        <div className="space-y-3">
          {result.treatment_plan.medications.length > 0 && (
            <div>
              <h4 className="font-medium">Medications</h4>
              <ul className="list-disc list-inside text-gray-600 pl-2">
                {result.treatment_plan.medications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {result.treatment_plan.lifestyle_changes.length > 0 && (
            <div>
              <h4 className="font-medium">Lifestyle Changes</h4>
              <ul className="list-disc list-inside text-gray-600 pl-2">
                {result.treatment_plan.lifestyle_changes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {result.treatment_plan.referrals.length > 0 && (
            <div>
              <h4 className="font-medium">Referrals</h4>
              <ul className="list-disc list-inside text-gray-600 pl-2">
                {result.treatment_plan.referrals.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Citations */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Citations</h3>
        <ul className="list-decimal list-inside text-sm space-y-1">
          {result.citations.map((citation, i) => (
            <li key={i}>
              <a
                href={citation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {citation}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
