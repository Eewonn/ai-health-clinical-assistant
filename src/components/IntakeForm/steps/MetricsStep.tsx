"use client";

import { PatientIntakeInput } from "@/lib/types";
import { calculateBMI } from "@/lib/validation";
import { IntakeInput } from "../IntakeInput";
import { Label } from "@/modules/ui/components/label";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (updates: Partial<Omit<PatientIntakeInput, "user_id">>) => void;
}

export default function MetricsStep({ formData, updateFormData }: Props) {
  const bmi =
    formData.height_cm > 0 && formData.weight_kg > 0
      ? calculateBMI(formData.height_cm, formData.weight_kg)
      : 0;

  const getBMICategory = (bmi: number) => {
    if (bmi === 0) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getBMIColor = (bmi: number) => {
    if (bmi === 0) return "text-gray-500";
    if (bmi < 18.5) return "text-yellow-600";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">Health metrics</h2>
        <p className="text-lg font-medium text-neutral-500">
          Basic measurements to help calculate risk and dosing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          <Label htmlFor="height" className="ml-4">Height (cm) *</Label>
          <IntakeInput
            id="height"
            type="number"
            value={formData.height_cm || ""}
            onChange={(e) =>
              updateFormData({ height_cm: parseFloat(e.target.value) || 0 })
            }
            placeholder="e.g., 170"
            min="30"
            max="300"
          />
        </div>

        <div className="space-y-5">
          <Label htmlFor="weight" className="ml-4">Weight (kg) *</Label>
          <IntakeInput
            id="weight"
            type="number"
            value={formData.weight_kg || ""}
            onChange={(e) =>
              updateFormData({ weight_kg: parseFloat(e.target.value) || 0 })
            }
            placeholder="e.g., 70"
            min="1"
            max="700"
          />
        </div>
      </div>

      {/* BMI Display */}
      <div className="rounded-xl border border-black/10 bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Calculated BMI</p>
        <p className={`text-2xl font-semibold ${getBMIColor(bmi)}`}>
          {bmi > 0 ? bmi : "--"}
          {bmi > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({getBMICategory(bmi)})
            </span>
          )}
        </p>
      </div>


    </div>
  );
}
