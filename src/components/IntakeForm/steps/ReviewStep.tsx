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

function ReviewCard({ icon: Icon, label, value }: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-[#e5e5e5] bg-white p-2 shadow-sm h-full min-h-[70px]">
      <div className="flex flex-col items-center gap-1 w-full text-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-50">
          <Icon className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">{label}</span>
          <div className="text-xs font-bold text-gray-900 leading-tight w-full truncate px-1" title={String(value || "-")}>
            {value || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-extrabold text-[#4b4b4b] mt-5 mb-3 flex items-center gap-2 uppercase tracking-wide">
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
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">Review Information</h2>
        <p className="text-muted-foreground font-medium">
          Confirm your details before generating the analysis.
        </p>
      </div>

      {/* Personal Info Grid */}
      <SectionTitle title="Personal Details" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ReviewCard
          icon={User}
          label="Full Name"
          value={formData.name}
        />
        <ReviewCard
          icon={Calendar}
          label="Age"
          value={formData.age ? `${formData.age} years` : "-"}
        />
        <ReviewCard
          icon={User}
          label="Sex"
          value={formData.sex}
        />
      </div>

      {/* Vitals Grid */}
      <SectionTitle title="Health Metrics" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ReviewCard
          icon={Ruler}
          label="Height"
          value={formData.height_cm ? `${formData.height_cm} cm` : "-"}
        />
        <ReviewCard
          icon={Weight}
          label="Weight"
          value={formData.weight_kg ? `${formData.weight_kg} kg` : "-"}
        />
        <ReviewCard
          icon={Activity}
          label="BMI"
          value={bmi}
        />
        <ReviewCard
          icon={HeartPulse}
          label="Blood Pres."
          value={formData.blood_pressure}
        />
      </div>

      {/* Lifestyle Grid */}
      <SectionTitle title="Lifestyle" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ReviewCard
          icon={Moon}
          label="Sleep"
          value={formData.lifestyle.sleep_hours ? `${formData.lifestyle.sleep_hours} hrs` : "-"}
        />
        <ReviewCard
          icon={Dumbbell}
          label="Exercise"
          value={formData.lifestyle.exercise}
        />
        <ReviewCard
          icon={Wine}
          label="Alcohol"
          value={formData.lifestyle.alcohol}
        />
        <ReviewCard
          icon={Activity}
          label="Smoking"
          value={formData.lifestyle.smoking ? "Yes" : "No"}
        />
      </div>

      {/* Medical History */}
      <SectionTitle title="Medical History" />
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-[#e5e5e5] bg-white p-4 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wide">Existing Conditions</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medical_history.conditions.length > 0 ? (
                formData.medical_history.conditions.map((c, i) => (
                  <Badge key={i} variant="secondary" className="px-2 py-0.5 text-xs font-bold">{c}</Badge>
                ))
              ) : (
                <span className="text-gray-400 italic text-xs">None listed</span>
              )}
            </div>
          </div>

          <div className="w-px bg-gray-100 hidden md:block"></div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wide">Allergies</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medical_history.allergies.length > 0 ? (
                formData.medical_history.allergies.map((a, i) => (
                  <Badge key={i} variant="destructive" className="px-2 py-0.5 text-xs font-bold">{a}</Badge>
                ))
              ) : (
                <span className="text-gray-400 italic text-xs">None listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medications & Complaint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Meds */}
        <div>
          <SectionTitle title="Medications" />
          <div className="rounded-xl border-2 border-[#e5e5e5] bg-white p-4 shadow-sm h-full min-h-[85px] flex flex-col justify-center">
            {formData.medications.length > 0 ? (
              <ul className="space-y-2">
                {formData.medications.map((med, i) => (
                  <li key={i} className="flex items-start gap-2 pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                    <Pill className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-gray-800">{med.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {med.dose} • {med.frequency}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Pill className="h-8 w-8 mb-1 text-gray-300" />
                <span className="text-xs font-medium">No medications listed</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Complaint */}
        <div>
          <SectionTitle title="Primary Goal" />
          <ReviewCard
            icon={FileText}
            label="Focus Area"
            value={formData.primary_complaint.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
          />
        </div>
      </div>
    </div>
  );
}
