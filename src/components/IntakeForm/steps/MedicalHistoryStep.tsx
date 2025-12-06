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
        <div className="mb-3 flex gap-2">
          <IntakeInput
            type="text"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
            placeholder="e.g., Diabetes, Hypertension"
          />
          <Button type="button" onClick={addCondition} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.medical_history.conditions.map((condition, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              {condition}
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          ))}
          {formData.medical_history.conditions.length === 0 && (
            <span className="text-sm text-muted-foreground">No conditions added</span>
          )}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <p className="mb-5 text-sm font-medium text-foreground">Allergies</p>
        <div className="mb-3 flex gap-2">
          <IntakeInput
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
            placeholder="e.g., Penicillin, Peanuts"
          />
          <Button type="button" onClick={addAllergy} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.medical_history.allergies.map((allergy, index) => (
            <Badge
              key={index}
              variant="destructive"
              className="inline-flex items-center gap-2"
            >
              {allergy}
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="text-xs text-destructive/80 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          {formData.medical_history.allergies.length === 0 && (
            <span className="text-sm text-muted-foreground">No allergies added</span>
          )}
        </div>
      </div>
    </div>
  );
}
