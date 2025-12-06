"use client";

import { PatientIntakeInput } from "@/lib/types";
import { calculateBMI } from "@/lib/validation";
import {
  User, Calendar, Ruler, Weight, Activity, HeartPulse,
  Moon, Dumbbell, Wine, Pill, AlertCircle, FileText
} from "lucide-react";
import { Badge } from "@/modules/ui/components/badge";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
}

function ReviewCard({ icon: Icon, label, value, iconColor = "text-blue-500" }: any) {
  return (
    <div className="flex flex-col items-start justify-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md h-full">
      <div className="flex items-center gap-2 w-full">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>

      <div className="text-lg font-bold text-gray-900 leading-tight pl-1.5 truncate w-full" title={String(value || "-")}>
        {value || "-"}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4 flex items-center gap-2">
      {title}
    </h3>
  );
}

export default function ReviewStep({ formData }: Props) {
  const bmi =
    formData.height_cm > 0 && formData.weight_kg > 0
      ? calculateBMI(formData.height_cm, formData.weight_kg)
      : 0;

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Review Information</h2>
        <p className="text-muted-foreground">
          Confirm your details before generating the analysis.
        </p>
      </div>

      {/* Personal Info Grid */}
      <SectionTitle title="Personal Details" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReviewCard
          icon={User}
          label="Full Name"
          value={formData.name}
          iconColor="text-blue-500"
        />
        <ReviewCard
          icon={Calendar}
          label="Age"
          value={formData.age ? `${formData.age} years` : "-"}
          iconColor="text-indigo-500"
        />
        <ReviewCard
          icon={User}
          label="Sex"
          value={formData.sex}
          iconColor="text-purple-500"
        />
      </div>

      {/* Vitals Grid */}
      <SectionTitle title="Health Metrics" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReviewCard
          icon={Ruler}
          label="Height"
          value={formData.height_cm ? `${formData.height_cm} cm` : "-"}
          iconColor="text-orange-500"
        />
        <ReviewCard
          icon={Weight}
          label="Weight"
          value={formData.weight_kg ? `${formData.weight_kg} kg` : "-"}
          iconColor="text-pink-500"
        />
        <ReviewCard
          icon={Activity}
          label="BMI"
          value={bmi}
          iconColor="text-red-500"
        />
        <ReviewCard
          icon={HeartPulse}
          label="Blood Pressure"
          value={formData.blood_pressure}
          iconColor="text-rose-500"
        />
      </div>

      {/* Lifestyle Grid */}
      <SectionTitle title="Lifestyle" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReviewCard
          icon={Moon}
          label="Sleep"
          value={formData.lifestyle.sleep_hours ? `${formData.lifestyle.sleep_hours} hrs` : "-"}
          iconColor="text-violet-500"
        />
        <ReviewCard
          icon={Dumbbell}
          label="Exercise"
          value={formData.lifestyle.exercise}
          iconColor="text-emerald-500"
        />
        <ReviewCard
          icon={Wine}
          label="Alcohol"
          value={formData.lifestyle.alcohol}
          iconColor="text-amber-600"
        />
        <ReviewCard
          icon={Activity}
          label="Smoking"
          value={formData.lifestyle.smoking ? "Yes" : "No"}
          iconColor="text-gray-500"
        />
      </div>

      {/* Medical History - Custom Wide Cards */}
      <SectionTitle title="Medical History" />
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h4 className="font-semibold text-gray-700">Existing Conditions</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medical_history.conditions.length > 0 ? (
                formData.medical_history.conditions.map((c, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">{c}</Badge>
                ))
              ) : (
                <span className="text-gray-400 italic">None listed</span>
              )}
            </div>
          </div>

          <div className="w-px bg-gray-100 hidden md:block"></div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h4 className="font-semibold text-gray-700">Allergies</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medical_history.allergies.length > 0 ? (
                formData.medical_history.allergies.map((a, i) => (
                  <Badge key={i} variant="destructive" className="px-3 py-1">{a}</Badge>
                ))
              ) : (
                <span className="text-gray-400 italic">None listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medications & Complaint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Meds */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            Medications
          </h3>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-full">
            {formData.medications.length > 0 ? (
              <ul className="space-y-3">
                {formData.medications.map((med, i) => (
                  <li key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <Pill className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-800">{med.name}</div>
                      <div className="text-xs text-gray-500">
                        {med.dose} • {med.frequency}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-4">
                <Pill className="h-10 w-10 mb-2 text-gray-300" />
                <span>No medications listed</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Complaint */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            Primary Goal
          </h3>
          <ReviewCard
            icon={FileText}
            label="Focus Area"
            value={formData.primary_complaint.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            iconColor="text-green-600"
          />
        </div>
      </div>
    </div>
  );
}
