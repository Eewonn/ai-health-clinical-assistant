"use client";

import { useState } from "react";
import { PatientIntakeInput } from "@/lib/types";
import { IntakeInput } from "../IntakeInput";
import { Button } from "@/modules/ui/components/button";
import { Badge } from "@/modules/ui/components/badge";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (updates: Partial<Omit<PatientIntakeInput, "user_id">>) => void;
}

export default function MedicalHistoryStep({ formData, updateFormData }: Props) {
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  const addCondition = () => {
    if (newCondition.trim()) {
      updateFormData({
        medical_history: {
          ...formData.medical_history,
          conditions: [...formData.medical_history.conditions, newCondition.trim()],
        },
      });
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    updateFormData({
      medical_history: {
        ...formData.medical_history,
        conditions: formData.medical_history.conditions.filter((_, i) => i !== index),
      },
    });
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      updateFormData({
        medical_history: {
          ...formData.medical_history,
          allergies: [...formData.medical_history.allergies, newAllergy.trim()],
        },
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    updateFormData({
      medical_history: {
        ...formData.medical_history,
        allergies: formData.medical_history.allergies.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">Medical history</h2>
        <p className="text-lg font-medium text-neutral-500">
          Add conditions and allergies to surface potential interactions.
        </p>
      </div>

      {/* Conditions */}
      <div>
        <p className="mb-5 text-sm font-medium text-foreground">Medical conditions</p>
        <div className="mb-3 relative">
          <IntakeInput
            type="text"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
            placeholder="e.g., Diabetes, Hypertension"
            className="pr-16"
          />
          <button
            type="button"
            onClick={addCondition}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-900 hover:text-gray-700 uppercase"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.medical_history.conditions.map((condition, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 font-bold text-gray-700"
            >
              {condition}
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="ml-1 text-gray-400 hover:text-gray-600 font-bold"
              >
                ×
              </button>
            </div>
          ))}
          {formData.medical_history.conditions.length === 0 && (
            <span className="text-sm text-gray-400 font-medium">No conditions added</span>
          )}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <p className="mb-5 text-sm font-medium text-foreground">Allergies</p>
        <div className="mb-3 relative">
          <IntakeInput
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
            placeholder="e.g., Penicillin, Peanuts"
            className="pr-16"
          />
          <button
            type="button"
            onClick={addAllergy}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-900 hover:text-gray-700 uppercase"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.medical_history.allergies.map((allergy, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 font-bold text-red-600"
            >
              {allergy}
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="ml-1 text-red-300 hover:text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
          {formData.medical_history.allergies.length === 0 && (
            <span className="text-sm text-gray-400 font-medium">No allergies added</span>
          )}
        </div>
      </div>
    </div>
  );
}
