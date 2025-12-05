"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Dashboard from "@/components/Dashboard";
import { AIAnalysisResult } from "@/lib/types";

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">AI Health Assistant</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <button
              onClick={() => {
                signOut();
                router.push("/signin");
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : !analysisResult ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">No analysis selected</h2>
            <p className="text-gray-500 mt-2">Please complete a new intake to view results.</p>
            <button
              onClick={() => router.push("/intake")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start New Intake
            </button>
          </div>
        ) : (
          <Dashboard result={analysisResult} />
        )}
      </div>
    </main>
  );
}
