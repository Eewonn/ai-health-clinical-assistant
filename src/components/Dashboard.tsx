"use client";

import { AIAnalysisResult, TreatmentPlan } from "@/lib/types";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface Props {
  result: AIAnalysisResult;
}

export default function Dashboard({ result }: Props) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [plan, setPlan] = useState<TreatmentPlan>(result.treatment_plan);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    result.status || "pending"
  );
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewerName, setReviewerName] = useState(user?.email || "Clinician");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/analysis/${result.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          treatment_plan: plan,
          action: "edited",
          reviewer_name: user?.email || "Clinician",
        }),
      });

      if (res.ok) {
        setIsEditing(false);
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/analysis/${result.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "approved",
          action: "approved",
          reviewer_name: reviewerName,
          reviewer_notes: reviewerNotes
        }),
      });

      if (res.ok) {
        setStatus("approved");
        setShowApproveModal(false);
      } else {
        alert("Failed to approve plan");
      }
    } catch (error) {
      console.error("Error approving plan:", error);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/analysis/${result.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "rejected",
          rejection_reason: rejectionReason,
          action: "rejected",
          reviewer_name: reviewerName,
          reviewer_notes: rejectionReason // Use rejection reason as notes
        }),
      });

      if (res.ok) {
        setStatus("rejected");
        setShowRejectModal(false);
      } else {
        alert("Failed to reject plan");
      }
    } catch (error) {
      console.error("Error rejecting plan:", error);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePlan = (field: keyof TreatmentPlan, value: string) => {
    const items = value.split("\n").filter((item) => item.trim() !== "");
    setPlan((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-gray-800">Clinical Dashboard</h1>
        <div className="space-x-4 flex items-center">
          {status === "approved" && (
            <div className="flex items-center space-x-4">
              <span className="text-green-600 font-medium flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Approved
              </span>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
          )}

          {status === "rejected" && (
            <span className="text-red-600 font-medium flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Rejected
            </span>
          )}
          
          {status === "pending" && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Edit Plan
                  </button>
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => setShowApproveModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Treatment Plan</h1>
        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <p><strong>Status:</strong> {status.toUpperCase()}</p>
          <p><strong>Reviewer:</strong> {reviewerName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
        {/* Panel 1: Treatment Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:border-gray-300 print:shadow-none">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Treatment Plan</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Medications</h3>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={4}
                  value={plan.medications.join("\n")}
                  onChange={(e) => updatePlan("medications", e.target.value)}
                  placeholder="Enter medications (one per line)"
                />
              ) : (
                plan.medications.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {plan.medications.map((med, i) => (
                      <li key={i}>{med}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">No medications prescribed</p>
                )
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Lifestyle Changes</h3>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={4}
                  value={plan.lifestyle_changes.join("\n")}
                  onChange={(e) => updatePlan("lifestyle_changes", e.target.value)}
                  placeholder="Enter lifestyle changes (one per line)"
                />
              ) : (
                plan.lifestyle_changes.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {plan.lifestyle_changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">No lifestyle changes recommended</p>
                )
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Referrals</h3>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={4}
                  value={plan.referrals.join("\n")}
                  onChange={(e) => updatePlan("referrals", e.target.value)}
                  placeholder="Enter referrals (one per line)"
                />
              ) : (
                plan.referrals.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {plan.referrals.map((ref, i) => (
                      <li key={i}>{ref}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">No referrals needed</p>
                )
              )}
            </div>
          </div>
        </div>

        {/* Panel 2: Risk Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:border-gray-300 print:shadow-none">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Risk Assessment</h2>
          
          <div className="flex flex-col items-center justify-center h-64 space-y-4 print:h-auto print:block">
            <div className="relative group print:hidden">
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

            {/* Print-friendly risk display */}
            <div className="hidden print:block mb-4">
              <p><strong>Risk Level:</strong> {result.risk_level.toUpperCase()}</p>
              <p className="text-sm text-gray-600">{getRiskDescription(result.risk_level)}</p>
            </div>

            <div className="text-center print:text-left">
              <p className="text-gray-500 text-sm mb-1">Patient Safety Score</p>
              <p className="text-3xl font-bold text-gray-800">{result.safety_score}/100</p>
            </div>
          </div>
        </div>

        {/* Panel 3: Flagged Issues */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:border-gray-300 print:shadow-none">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Flagged Issues</h2>
          
          <div className="space-y-4">
            {result.flagged_issues.drug_interactions.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 print:border-gray-300">
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
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 print:border-gray-300">
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
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 print:border-gray-300">
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

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Approve Treatment Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Reviewer Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                <textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Approving..." : "Confirm Approval"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600">Reject Treatment Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Reviewer Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason for Rejection *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  rows={3}
                  placeholder="Please explain why this plan is being rejected..."
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={isSaving || !rejectionReason.trim()}
                >
                  {isSaving ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
