"use client";

import { PatientIntakeInput, PrimaryComplaint } from "@/lib/types";
import { Badge } from "@/modules/ui/components/badge";

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
    <div className="space-y-16">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">
          Primary complaint
        </h2>
        <p className="text-lg font-medium text-neutral-500">
          Select the main reason for your visit today.
        </p>
      </div>

      <div className="grid gap-5">
        {complaints.map((complaint) => (
          <label
            key={complaint.value}
            className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${formData.primary_complaint === complaint.value
              ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
              : "border-border hover:border-muted-foreground/30"
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
              className="mt-1 h-4 w-4 accent-primary"
            />
            <div>
              <p className="font-medium">{complaint.label}</p>
              <p className="text-sm text-muted-foreground">
                {complaint.description}
              </p>
              {formData.primary_complaint === complaint.value && (
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Selected
                  </Badge>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
