"use client";

import { PatientIntakeInput } from "@/lib/types";
import { IntakeInput } from "../IntakeInput";
import { IntakeSelect } from "../IntakeSelect";
import { Label } from "@/modules/ui/components/label";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (updates: Partial<Omit<PatientIntakeInput, "user_id">>) => void;
}

export default function LifestyleStep({ formData, updateFormData }: Props) {
  const updateLifestyle = (updates: Partial<typeof formData.lifestyle>) => {
    updateFormData({
      lifestyle: { ...formData.lifestyle, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">Lifestyle</h2>
        <p className="text-lg font-medium text-neutral-500">
          Your daily habits help us tailor recommendations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-5">
          <Label htmlFor="exercise" className="ml-4">Exercise level *</Label>
          <IntakeSelect
            id="exercise"
            value={formData.lifestyle.exercise}
            onChange={(e) => updateLifestyle({ exercise: e.target.value })}
          >
            <option value="">Select exercise level</option>
            <option value="none">None</option>
            <option value="light">Light (1-2 days/week)</option>
            <option value="moderate">Moderate (3-4 days/week)</option>
            <option value="heavy">Heavy (5+ days/week)</option>
          </IntakeSelect>
        </div>

        <div className="space-y-5">
          <Label htmlFor="sleep" className="ml-4">Average sleep hours *</Label>
          <IntakeInput
            id="sleep"
            type="number"
            value={formData.lifestyle.sleep_hours || ""}
            onChange={(e) =>
              updateLifestyle({ sleep_hours: parseFloat(e.target.value) || 0 })
            }
            placeholder="e.g., 7"
            min={0}
            max={24}
            step={0.5}
          />
        </div>

        <div className="space-y-5">
          <Label className="ml-4">Do you smoke? *</Label>
          <div className="flex gap-4 ml-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={formData.lifestyle.smoking === true}
                onChange={() => updateLifestyle({ smoking: true })}
                className="h-4 w-4 accent-foreground"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={formData.lifestyle.smoking === false}
                onChange={() => updateLifestyle({ smoking: false })}
                className="h-4 w-4 accent-foreground"
              />
              No
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <Label htmlFor="alcohol" className="ml-4">Alcohol consumption *</Label>
          <IntakeSelect
            id="alcohol"
            value={formData.lifestyle.alcohol}
            onChange={(e) => updateLifestyle({ alcohol: e.target.value })}
          >
            <option value="">Select alcohol consumption</option>
            <option value="none">None</option>
            <option value="occasional">Occasional (1-2 drinks/week)</option>
            <option value="moderate">Moderate (3-7 drinks/week)</option>
            <option value="heavy">Heavy (8+ drinks/week)</option>
          </IntakeSelect>
        </div>
      </div>
    </div>
  );
}
