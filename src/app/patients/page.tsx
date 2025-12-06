"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

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
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user) {
      fetchPatients();
    }
  }, [user, isLoading]);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
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
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 font-bold";
      case "medium":
        return "text-orange-600 font-medium";
      default:
        return "text-green-600";
    }
  };

  if (isLoading || loading) {
    return <LoadingSpinner text="Loading patient records..." />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <Link
            href="/intake"
            className="h-[45px] px-6 flex items-center rounded-xl bg-[#ff4b4b] text-[13px] font-extrabold tracking-widest text-white uppercase shadow-[0_4px_0_#ea2b2b] transition hover:bg-[#ff5c5c] active:translate-y-[4px] active:shadow-none"
          >
            New Intake
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-black/10">
          <table className="min-w-full divide-y divide-black/10">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/10">
              {patients.map((patient) => {
                const analysis = patient.ai_analysis_results?.[0];
                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(patient.intake_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {patient.primary_complaint.replace("_", " ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {analysis ? (
                        <span className={`text-sm ${getRiskColor(analysis.risk_level)}`}>
                          {analysis.risk_level.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {analysis ? (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            analysis.status
                          )}`}
                        >
                          {analysis.status.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Pending Analysis</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {analysis ? (
                        <Link
                          href={`/analysis/${analysis.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Plan
                        </Link>
                      ) : (
                        <span className="text-gray-400">No Plan</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {patients.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No patient records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
