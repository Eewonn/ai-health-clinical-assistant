"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

interface PatientRecord {
  id: string;
  name: string;
  intake_date: string;
  primary_complaint: string;
  ai_analysis_results: {
    id: string;
    status: "pending" | "approved" | "rejected";
    risk_level: "low" | "medium" | "high";
  }[];
}

import LoadingSpinner from "@/components/LoadingSpinner";

export default function PatientsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        fetchPatients();
      } else {
        router.push("/signin");
      }
    }
  }, [user, isLoading, router]);

  const fetchPatients = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch("/api/patients", {
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
      });
      
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-[#ef4444]";
      case "medium":
        return "text-[#f97316]";
      default:
        return "text-[#22c55e]";
    }
  };

  if (isLoading || loading) {
    return <LoadingSpinner text="Loading patient records..." />;
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfcfd]">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#2d2d2d]">
              Patient Records
            </h1>
            <p className="text-gray-500 font-medium">
              Manage and view patient intakes and analysis
            </p>
          </div>
          <Link
            href="/intake"
            className="h-[46px] px-6 flex items-center rounded-xl bg-[#ff4b4b] text-[13px] font-extrabold tracking-widest text-white uppercase shadow-[0_4px_0_#ea2b2b] transition hover:bg-[#ff5c5c] active:translate-y-[4px] active:shadow-none hover:shadow-[0_4px_0_#ea2b2b]"
          >
            New Intake
          </Link>
        </div>

        <div className="w-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fafafa]">
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Complaint
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Risk Level
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((patient) => {
                  const analysis = patient.ai_analysis_results?.[0];
                  return (
                    <tr
                      key={patient.id}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[15px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                          {patient.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-gray-400">
                          {new Date(patient.intake_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[14px] font-bold text-gray-600 capitalize">
                          {patient.primary_complaint.replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {analysis ? (
                          <span
                            className={`text-[12px] font-extrabold tracking-wide uppercase ${getRiskColor(
                              analysis.risk_level
                            )}`}
                          >
                            {analysis.risk_level}
                          </span>
                        ) : (
                          <span className="text-[12px] font-bold text-gray-300 uppercase tracking-wide">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {analysis ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border ${getStatusColor(
                              analysis.status
                            )}`}
                          >
                            {analysis.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border bg-gray-50 text-gray-400 border-gray-100">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {analysis ? (
                          <Link
                            href={`/analysis/${analysis.id}`}
                            className="inline-flex text-[13px] font-extrabold text-[#ff4b4b] hover:text-[#e03a3a] transition-colors relative group/link"
                          >
                            View Plan
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#ff4b4b] transition-all group-hover/link:w-full opacity-30"></span>
                          </Link>
                        ) : (
                          <span className="text-[13px] font-bold text-gray-300">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {patients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No records yet
                </h3>
                <p className="text-gray-500 max-w-sm mt-1 mb-6">
                  Get started by creating a new patient intake.
                </p>
                <Link
                  href="/intake"
                  className="text-sm font-bold text-[#ff4b4b] hover:text-[#e03a3a]"
                >
                  Start New Intake →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
