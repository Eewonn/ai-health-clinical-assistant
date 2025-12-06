"use client";

import { PatientIntakeInput } from "@/lib/types";
import { IntakeInput } from "../IntakeInput";
import { IntakeSelect } from "../IntakeSelect";
import { IntakeImageUpload } from "../IntakeImageUpload";
import { Label } from "@/modules/ui/components/label";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (
    updates: Partial<Omit<PatientIntakeInput, "user_id">>,
  ) => void;
}

export default function PersonalInfoStep({ formData, updateFormData }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">
          Personal information
        </h2>
        <p className="text-lg font-medium text-neutral-500">
          Tell us a bit about you to personalize the assessment.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Label
            htmlFor="name"
            className="ml-4 text-base font-semibold text-gray-700"
          >
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

        <div className="flex flex-col gap-4">
          <Label
            htmlFor="age"
            className="ml-4 text-base font-semibold text-gray-700"
          >
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

        <div className="flex flex-col gap-4">
          <Label
            htmlFor="sex"
            className="ml-4 text-base font-semibold text-gray-700"
          >
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

        <div className="flex flex-col gap-4">
          <Label
            htmlFor="blood_pressure"
            className="ml-4 text-base font-semibold text-gray-700"
          >
            Blood Pressure (optional)
          </Label>
          <IntakeInput
            id="blood_pressure"
            type="text"
            value={formData.blood_pressure || ""}
            onChange={(e) => updateFormData({ blood_pressure: e.target.value })}
            placeholder="e.g. 120/80"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Label className="ml-4 text-base font-semibold text-gray-700">
            Full Body Picture (optional)
          </Label>
          <div className="px-1">
            <IntakeImageUpload
              value={formData.full_body_image}
              onChange={(value) => updateFormData({ full_body_image: value })}
            />
            <p className="mt-3 text-sm font-medium text-gray-400 ml-4">
              This helps our AI analyze your physical condition more accurately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
