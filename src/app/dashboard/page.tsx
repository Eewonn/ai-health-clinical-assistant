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
  const [patientImage, setPatientImage] = useState<string | undefined>(undefined);
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

          // Fetch associated intake to get the image
          if (result.data.intake_id) {
            try {
              const intakeRes = await fetch(`/api/intake?id=${result.data.intake_id}`);
              const intakeResult = await intakeRes.json();

              if (intakeResult.success) {
                // API might return array or single object depending on implementation details
                const intakeData = Array.isArray(intakeResult.data)
                  ? intakeResult.data[0]
                  : intakeResult.data;

                if (intakeData?.full_body_image) {
                  setPatientImage(intakeData.full_body_image);
                }
              }
            } catch (err) {
              console.error("Failed to fetch intake image", err);
            }
          }

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
    <div className="min-h-screen w-full flex items-center justify-center pt-[70px] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/header-icon.png"
              alt="Icon"
              className="w-10 h-10 -rotate-12"
            />
            <h1 className="text-3xl font-bold tracking-tight">
              AI Health Assistant
            </h1>
          </div>
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
          <Dashboard result={analysisResult} patientImage={patientImage} />
        )}
      </div>
    </div>
  );
}
