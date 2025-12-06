"use client";

import { PatientIntakeInput } from "@/lib/types";
import { IntakeInput } from "../IntakeInput";
import { IntakeSelect } from "../IntakeSelect";
import { Label } from "@/modules/ui/components/label";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (
    updates: Partial<Omit<PatientIntakeInput, "user_id">>,
  ) => void;
}

export default function PersonalInfoStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-16">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">
          Personal information
        </h2>
        <p className="text-lg font-medium text-neutral-500">
          Tell us a bit about you to personalize the assessment.
        </p>
      </div>

      <div className="space-y-10">
        <div className="space-y-5">
          <Label htmlFor="name" className="ml-4">
            Full name *
          </Label>
          <IntakeInput
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-5">
          <Label htmlFor="age" className="ml-4">
            Age *
          </Label>
          <IntakeInput
            id="age"
            type="number"
            value={formData.age || ""}
            onChange={(e) =>
              updateFormData({ age: parseInt(e.target.value) || 0 })
            }
            placeholder="Enter your age"
            min={0}
            max={150}
          />
        </div>

        <div className="space-y-5">
          <Label htmlFor="sex" className="ml-4">
            Sex *
          </Label>
          <IntakeSelect
            id="sex"
            value={formData.sex}
            onChange={(e) =>
              updateFormData({
                sex: e.target.value as "male" | "female" | "other",
              })
            }
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </IntakeSelect>
        </div>
      </div>
    </div>
  );
}
