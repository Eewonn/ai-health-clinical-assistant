"use client";

import { PatientIntakeInput, PrimaryComplaint } from "@/lib/types";


interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (
    updates: Partial<Omit<PatientIntakeInput, "user_id">>,
  ) => void;
}

const complaints: {
  value: PrimaryComplaint;
  label: string;
  description: string;
}[] = [
    {
      value: "erectile_dysfunction",
      label: "Erectile Dysfunction",
      description: "Difficulty achieving or maintaining an erection",
    },
    {
      value: "hair_loss",
      label: "Hair Loss",
      description: "Thinning hair or baldness",
    },
    {
      value: "weight_loss",
      label: "Weight Management",
      description: "Difficulty losing or managing weight",
    },
    {
      value: "fatigue",
      label: "Fatigue",
      description: "Persistent tiredness or lack of energy",
    },
    {
      value: "anxiety",
      label: "Anxiety",
      description: "Excessive worry or nervousness",
    },
    {
      value: "depression",
      label: "Depression",
      description: "Persistent sadness or loss of interest",
    },
    {
      value: "sleep_issues",
      label: "Sleep Issues",
      description: "Difficulty falling or staying asleep",
    },
    {
      value: "other",
      label: "Other",
      description: "Other health concerns not listed above",
    },
  ];

export default function ComplaintStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">
          Primary complaint
        </h2>
        <p className="text-lg font-medium text-neutral-500">
          Select the main reason for your visit today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {complaints.map((complaint) => (
          <label
            key={complaint.value}
            className={`flex cursor-pointer items-center justify-start rounded-xl border px-6 py-4 text-left text-lg font-bold transition-all ${formData.primary_complaint === complaint.value
                ? "border-red-300 bg-red-50 text-red-600 shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
          >
            <input
              type="radio"
              name="primary_complaint"
              value={complaint.value}
              checked={formData.primary_complaint === complaint.value}
              onChange={(e) =>
                updateFormData({
                  primary_complaint: e.target.value as PrimaryComplaint,
                })
              }
              className="sr-only"
            />
            {complaint.label}
          </label>
        ))}
      </div>
    </div>
  );
}
