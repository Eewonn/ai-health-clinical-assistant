"use client";

import { AIAnalysisResult, TreatmentPlan } from "@/lib/types";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/modules/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/ui/components/card";
import { Badge } from "@/modules/ui/components/badge";

interface Props {
  result: AIAnalysisResult;
  patientImage?: string;
}

export default function Dashboard({ result, patientImage }: Props) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [plan, setPlan] = useState<TreatmentPlan>(result.treatment_plan);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    result.status || "pending",
  );

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewerName, setReviewerName] = useState(user?.email || "Clinician");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

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

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
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
          reviewer_notes: reviewerNotes,
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
          reviewer_notes: rejectionReason,
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
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approved
              </span>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download PDF
              </button>
            </div>
          )}
          {/* Add remaining status and buttons */}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
        {/* Left Column: Clinical Solution (8 cols) */}
        <div className="lg:col-span-8 space-y-5">

          {/* Clinical Summary */}
          <Card className="rounded-xl border border-black/10 bg-white shadow-[0_4px_0_rgba(0,0,0,0.2)]">
            <CardHeader>
              <CardTitle>Clinical Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">{result.summary}</p>
            </CardContent>
          </Card>

          {/* Visual Summary */}
          {(result.visual_summary || patientImage) && (
            <Card className="rounded-xl border border-black/10 bg-white shadow-[0_4px_0_rgba(0,0,0,0.2)]">
              <CardHeader>
                <CardTitle>Visual Analysis</CardTitle>
                <CardDescription>
                  AI assessment of physical presentation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientImage && (
                  <div className="flex justify-center bg-slate-50 rounded-lg p-4 border border-dashed border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={patientImage}
                      alt="Patient full body"
                      className="max-h-[300px] w-auto rounded shadow-sm object-contain"
                    />
                  </div>
                )}
                {result.visual_summary ? (
                  <p className="text-gray-700 leading-relaxed">
                    {result.visual_summary}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No visual analysis summary generated yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Treatment Plan */}
          <Card className="rounded-xl border border-black/10 bg-white shadow-[0_4px_0_rgba(0,0,0,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Treatment Plan</CardTitle>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="h-10 rounded-xl border-2 border-transparent text-gray-500 font-extrabold uppercase tracking-wide hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="h-10 px-6 rounded-xl bg-[#58cc02] border-2 border-[#58cc02] text-white shadow-[0_4px_0_#46a302] font-extrabold uppercase tracking-wide transition hover:bg-[#61e002] active:translate-y-[2px] active:shadow-none"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      disabled={status !== "pending"}
                      className="h-10 px-4 rounded-xl border-2 border-[#e5e5e5] bg-white text-gray-700 shadow-[0_4px_0_#e5e5e5] font-extrabold uppercase tracking-wide transition hover:bg-slate-50 active:translate-y-[2px] active:shadow-none"
                    >
                      Edit Plan
                    </Button>
                    {status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowRejectModal(true)}
                          className="h-10 px-4 rounded-xl border-2 border-[#e5e5e5] bg-white text-[#ff4b4b] shadow-[0_4px_0_#e5e5e5] font-extrabold uppercase tracking-wide transition hover:bg-slate-50 active:translate-y-[2px] active:shadow-none hover:text-[#ff4b4b]"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowApproveModal(true)}
                          className="h-10 px-6 rounded-xl bg-[#58cc02] border-2 border-[#58cc02] text-white shadow-[0_4px_0_#46a302] font-extrabold uppercase tracking-wide transition hover:bg-[#61e002] active:translate-y-[2px] active:shadow-none"
                        >
                          Approve
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Medications */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">
                    💊
                  </span>
                  Medications
                </h3>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[100px] p-4 rounded-xl border-2 border-[#e5e5e5] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y"
                    value={plan.medications.join("\n")}
                    onChange={(e) => updatePlan("medications", e.target.value)}
                  />
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {plan.medications.map((med, i) => (
                      <li key={i}>{med}</li>
                    ))}
                    {plan.medications.length === 0 && (
                      <li className="text-gray-400 italic">
                        No medications recommended
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Lifestyle Changes */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-green-100 text-green-800 p-1 rounded mr-2">
                    🥗
                  </span>
                  Lifestyle Changes
                </h3>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[100px] p-4 rounded-xl border-2 border-[#e5e5e5] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y"
                    value={plan.lifestyle_changes.join("\n")}
                    onChange={(e) =>
                      updatePlan("lifestyle_changes", e.target.value)
                    }
                  />
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {plan.lifestyle_changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                    {plan.lifestyle_changes.length === 0 && (
                      <li className="text-gray-400 italic">
                        No lifestyle changes recommended
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Referrals */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="bg-purple-100 text-purple-800 p-1 rounded mr-2">
                    👨‍⚕️
                  </span>
                  Referrals
                </h3>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[100px] p-4 rounded-xl border-2 border-[#e5e5e5] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y"
                    value={plan.referrals.join("\n")}
                    onChange={(e) => updatePlan("referrals", e.target.value)}
                  />
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {plan.referrals.map((ref, i) => (
                      <li key={i}>{ref}</li>
                    ))}
                    {plan.referrals.length === 0 && (
                      <li className="text-gray-400 italic">
                        No referrals recommended
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          {/* Risk Assessment */}
          <Card className="rounded-xl border-2 border-[#e5e5e5] bg-white shadow-[0_4px_0_#e5e5e5]">
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Overall Risk</span>
                <Badge
                  variant={getRiskBadgeVariant(result.risk_level)}
                  className="capitalize text-base px-3 py-1 font-bold"
                >
                  {result.risk_level}
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {getRiskDescription(result.risk_level)}
              </p>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Safety Score</span>
                  <span className="font-bold text-xl text-gray-800">
                    {result.safety_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 border-b-2 border-gray-200">
                  <div
                    className={`h-4 rounded-full ${result.safety_score > 80
                      ? "bg-[#58cc02] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]"
                      : result.safety_score > 50
                        ? "bg-yellow-400 shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]"
                        : "bg-[#ff4b4b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]"
                      }`}
                    style={{ width: `${result.safety_score}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flagged Issues */}
          {(result.flagged_issues.drug_interactions.length > 0 ||
            result.flagged_issues.contraindications.length > 0 ||
            result.flagged_issues.warnings.length > 0) && (
              <Card className="rounded-xl border-2 border-red-100 bg-red-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#ff4b4b] font-extrabold uppercase tracking-wide flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Flagged Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.flagged_issues.drug_interactions.length > 0 && (
                    <div>
                      <h4 className="font-bold text-[#ff4b4b] text-xs uppercase tracking-wider mb-1">
                        Drug Interactions
                      </h4>
                      <ul className="list-disc list-inside text-sm font-medium text-red-600">
                        {result.flagged_issues.drug_interactions.map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {result.flagged_issues.contraindications.length > 0 && (
                    <div>
                      <h4 className="font-bold text-[#ff4b4b] text-xs uppercase tracking-wider mb-1">
                        Contraindications
                      </h4>
                      <ul className="list-disc list-inside text-sm font-medium text-red-600">
                        {result.flagged_issues.contraindications.map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {result.flagged_issues.warnings.length > 0 && (
                    <div>
                      <h4 className="font-bold text-[#ff4b4b] text-xs uppercase tracking-wider mb-1">
                        Warnings
                      </h4>
                      <ul className="list-disc list-inside text-sm font-medium text-red-600">
                        {result.flagged_issues.warnings.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Research Summary - RAG System */}
          {/* Research Summary - RAG System */}
          <Card className="rounded-xl border-2 border-[#e5e5e5] bg-white shadow-[0_4px_0_#e5e5e5]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Research Summary
              </CardTitle>
              <CardDescription>
                Evidence-based insights sourced from clinical literature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.research_summary ? (
                <p className="text-gray-700 leading-relaxed text-sm">
                  {result.research_summary}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="rounded-full bg-white p-3 shadow-sm border border-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-300"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Research compilation in progress...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Citations */}
          {result.citations.length > 0 && (
            <Card className="rounded-xl border border-black/10 bg-white shadow-[0_4px_0_rgba(0,0,0,0.2)]">
              <CardHeader>
                <CardTitle className="text-base">References</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-decimal list-inside text-sm text-gray-500 space-y-1">
                  {result.citations.map((citation, i) => (
                    <li key={i} className="break-words">
                      {citation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Clinical Review Actions */}
          {user?.role === "clinician" && status === "pending" && (
            <Card className="rounded-xl border border-black/10 bg-blue-50 shadow-[0_4px_0_rgba(0,0,0,0.2)]">
              <CardHeader>
                <CardTitle className="text-blue-800">Clinical Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setShowApproveModal(true)}
                  disabled={isEditing}
                >
                  Approve Plan
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isEditing}
                >
                  Reject & Request Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Special Mentions (4 cols) */}
        <div className="lg:col-span-4 space-y-5">

          {/* Meal Plan */}
          {result.meal_plan && (
            <Card className="rounded-xl border border-black/10 bg-white shadow-[0_4px_0_rgba(0,0,0,0.2)] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">

                  Meal Prep Suggestion
                </CardTitle>
                <CardDescription>
                  Recommended category based on your health profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center p-4 rounded-lg">
                  <span className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                    {result.meal_plan.category}
                  </span>
                </div>

                <a
                  href={`https://nummeals.com?category=${result.meal_plan.category}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full h-[50px] rounded-xl bg-[#ff4b4b] text-[15px] font-extrabold tracking-widest text-white uppercase shadow-[0_4px_0_#ea2b2b] transition hover:bg-[#ff5c5c] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2">
                    Get Meal Plan
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" x2="21" y1="14" y2="3" />
                    </svg>
                  </button>
                </a>
              </CardContent>
            </Card>
          )}

          {/* GoRocky Recommendation */}
          {result.gorocky_recommendation && (
            <Card className="rounded-xl border border-black/10 bg-white shadow-[0_4px_0_rgba(0,0,0,0.2)] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  Product Recommendation
                </CardTitle>
                <CardDescription>
                  Tailored suggestion from our partner.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-2">
                    {result.gorocky_recommendation.product}
                  </span>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {result.gorocky_recommendation.reasoning}
                  </p>
                </div>

                <a
                  href="https://gorocky.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full h-[50px] rounded-xl bg-[#ff4b4b] text-[15px] font-extrabold tracking-widest text-white uppercase shadow-[0_4px_0_#ea2b2b] transition hover:bg-[#ff5c5c] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2">
                    Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-extrabold text-[#2d2d2d] mb-6 flex items-center gap-2">
              <span className="bg-[#58cc02] text-white p-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              Approve Treatment Plan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reviewer Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border-2 border-[#e5e5e5] p-3 text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none transition-colors"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes (Optional)</label>
                <textarea
                  className="w-full rounded-xl border-2 border-[#e5e5e5] p-3 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none transition-colors min-h-[100px] resize-none"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Add any additional context..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-gray-500 font-extrabold uppercase tracking-wide text-xs hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#58cc02] border-2 border-[#58cc02] text-white shadow-[0_4px_0_#46a302] font-extrabold uppercase tracking-wide text-xs transition hover:bg-[#61e002] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isSaving ? "Approving..." : "Confirm Approval"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-extrabold text-[#ff4b4b] mb-6 flex items-center gap-2">
              <span className="bg-[#ff4b4b] text-white p-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </span>
              Reject Treatment Plan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reviewer Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border-2 border-[#e5e5e5] p-3 text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none transition-colors"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Rejection Reason *</label>
                <textarea
                  className="w-full rounded-xl border-2 border-red-100 bg-red-50 p-3 text-sm font-medium text-gray-700 placeholder:text-red-300 focus:border-red-300 focus:outline-none transition-colors min-h-[100px] resize-none"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Why is this plan being rejected?"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#e5e5e5] text-gray-500 font-extrabold uppercase tracking-wide text-xs hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#ff4b4b] border-2 border-[#ff4b4b] text-white shadow-[0_4px_0_#d93838] font-extrabold uppercase tracking-wide text-xs transition hover:bg-[#ff5c5c] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:pointer-events-none"
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
