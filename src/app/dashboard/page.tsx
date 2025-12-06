"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Dashboard from "@/components/Dashboard";
import { AIAnalysisResult } from "@/lib/types";
import { Button } from "@/modules/ui/components/button";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("id");

  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/analysis/${analysisId}`);
        const result = await response.json();

        if (result.success) {
          setAnalysisResult(result.data);
        } else {
          setError(result.error || "Failed to load analysis.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (user && analysisId) {
      fetchAnalysis();
    } else if (!analysisId) {
        setLoading(false);
    }
  }, [user, analysisId]);

  if (isLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Health Assistant
        </h1>
        <p className="text-muted-foreground">
          Clinical decision support based on your intake.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : !analysisResult ? (
        <div className="rounded-xl border bg-card px-6 py-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">
            No analysis selected
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete a new intake to generate an AI-assisted clinical summary.
          </p>
          <Button
            className="mt-5"
            onClick={() => router.push("/intake")}
          >
            Start new intake
          </Button>
        </div>
      ) : (
        <Dashboard result={analysisResult} />
      )}
    </div>
  );
}
