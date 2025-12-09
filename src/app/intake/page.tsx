"use client";

import { useState, useEffect } from "react";
import IntakeForm from "@/components/IntakeForm";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { AIAnalysisResult, PatientIntake } from "@/lib/types";
import { Button } from "@/modules/ui/components/button";

import LoadingSpinner from "@/components/LoadingSpinner";

export default function IntakePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [analysisState, setAnalysisState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(
    null,
  );
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
        router.push(`/analysis/${result.data.id}`);
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
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-start mt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[700px]">
        {analysisState === "idle" && (
          <IntakeForm onFormSubmit={handleFormSubmit} />
        )}

        {analysisState === "loading" && (
          <LoadingSpinner text="Analyzing data... Please wait while the AI assistant reviews the information." />
        )}

        {analysisState === "error" && (
          <div className="space-y-4 text-center py-10">
            <h2 className="text-xl font-semibold text-destructive">
              Analysis failed
            </h2>
            <p className="text-sm text-muted-foreground">{analysisError}</p>
            <Button onClick={() => setAnalysisState("idle")}>Try again</Button>
          </div>
        )}
      </div>
    </div>
  );
}
