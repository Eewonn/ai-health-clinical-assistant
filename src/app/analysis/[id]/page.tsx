"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { AIAnalysisResult } from "@/lib/types";
import Link from "next/link";

import LoadingSpinner from "@/components/LoadingSpinner";

export default function AnalysisPage() {
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch(`/api/analysis/${id}`);
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to load analysis");
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError("An error occurred while loading the analysis");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading analysis..." />;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Analysis not found"}</p>
          <Link
            href="/patients"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-8 pb-24 px-4 sm:px-6 lg:px-8 bg-gray-50 print:bg-white print:p-0 print:block">
      <div className="w-full max-w-7xl">
        <div className="mb-6 print:hidden">
          <Link
            href="/patients"
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Patients
          </Link>
        </div>
        <Dashboard result={result} />
      </div>
    </div>
  );
}
