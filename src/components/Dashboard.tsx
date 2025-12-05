"use client";

import { AIAnalysisResult } from "@/lib/types";
import { useState } from "react";

interface Props {
  result: AIAnalysisResult;
}

export default function Dashboard({ result }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-orange-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getRiskDescription = (level: string) => {
    switch (level) {
      case "high":
        return "High risk detected. Immediate attention required.";
      case "medium":
        return "Moderate risk. Monitor closely and consider interventions.";
      default:
        return "Low risk. Standard care recommended.";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Clinical Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {isEditing ? "Cancel Edit" : "Edit Plan"}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Approve Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1: Treatment Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Treatment Plan</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Medications</h3>
              {result.treatment_plan.medications.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {result.treatment_plan.medications.map((med, i) => (
                    <li key={i}>{med}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">No medications prescribed</p>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Lifestyle Changes</h3>
              {result.treatment_plan.lifestyle_changes.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {result.treatment_plan.lifestyle_changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">No lifestyle changes recommended</p>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Referrals</h3>
              {result.treatment_plan.referrals.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {result.treatment_plan.referrals.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">No referrals needed</p>
              )}
            </div>
          </div>
        </div>

        {/* Panel 2: Risk Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Risk Assessment</h2>
          
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="relative group">
              <div 
                className={`w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ${getRiskColor(result.risk_level)}`}
              >
                {result.risk_level.toUpperCase()}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center pointer-events-none">
                {getRiskDescription(result.risk_level)}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Patient Safety Score</p>
              <p className="text-3xl font-bold text-gray-800">{result.safety_score}/100</p>
            </div>
          </div>
        </div>

        {/* Panel 3: Flagged Issues */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Flagged Issues</h2>
          
          <div className="space-y-4">
            {result.flagged_issues.drug_interactions.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <h3 className="font-medium text-red-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Interactions
                </h3>
                <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                  {result.flagged_issues.drug_interactions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.flagged_issues.contraindications.length > 0 && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <h3 className="font-medium text-orange-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Contraindications
                </h3>
                <ul className="list-disc list-inside text-orange-700 text-sm space-y-1">
                  {result.flagged_issues.contraindications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.flagged_issues.warnings.length > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Warnings
                </h3>
                <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                  {result.flagged_issues.warnings.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.flagged_issues.drug_interactions.length === 0 &&
             result.flagged_issues.contraindications.length === 0 &&
             result.flagged_issues.warnings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No critical issues flagged</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
