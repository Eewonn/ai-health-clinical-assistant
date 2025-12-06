"use client";

import { AIAnalysisResult, TreatmentPlan } from "@/lib/types";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context"; // From `origin/main`
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
}

export default function Dashboard({ result }: Props) {
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

      {/* Your layout code for treatment plan, risk assessment, and flagged issues follows */}
    </div>
  );
}
