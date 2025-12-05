"use client";

import { useState, useEffect } from "react";
import IntakeForm from "@/components/IntakeForm";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { AIAnalysisResult, PatientIntake } from "@/lib/types";

export default function IntakePage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [analysisState, setAnalysisState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  const handleFormSubmit = async (intakeData: PatientIntake) => {
    setAnalysisState("loading");
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeId: intakeData.id }),
      });

      const result = await response.json();

      if (result.success && result.data?.id) {
        router.push(`/dashboard?id=${result.data.id}`);
      } else {
        setAnalysisError(result.error || "Failed to analyze data.");
        setAnalysisState("error");
      }
    } catch (error) {
      setAnalysisError("An unexpected error occurred.");
      setAnalysisState("error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-6 mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <button
          onClick={() => {
            signOut();
            router.push("/signin");
          }}
          className="text-sm text-red-600 hover:underline"
        >
          Sign Out
        </button>
      </div>

      {analysisState === "idle" && <IntakeForm onFormSubmit={handleFormSubmit} />}

      {analysisState === "loading" && (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-xl font-semibold">Analyzing Data...</h2>
          <p className="text-gray-600">
            Please wait while our AI assistant reviews the information.
          </p>
        </div>
      )}

      {analysisState === "error" && (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600">Analysis Failed</h2>
          <p className="text-gray-600 mb-4">{analysisError}</p>
          <button
            onClick={() => setAnalysisState("idle")}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
    </main>
  );
}
