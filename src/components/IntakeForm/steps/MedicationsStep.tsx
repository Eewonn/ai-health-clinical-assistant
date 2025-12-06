"use client";

import { useState } from "react";
import { PatientIntakeInput, Medication } from "@/lib/types";
import { IntakeInput } from "../IntakeInput";
import { IntakeSelect } from "../IntakeSelect";
import { Button } from "@/modules/ui/components/button";
import { Badge } from "@/modules/ui/components/badge";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (
    updates: Partial<Omit<PatientIntakeInput, "user_id">>,
  ) => void;
}

const emptyMedication: Medication = {
  name: "",
  dose: "",
  frequency: "",
  route: "",
};

export default function MedicationsStep({ formData, updateFormData }: Props) {
  const [newMed, setNewMed] = useState<Medication>(emptyMedication);

  const addMedication = () => {
    if (
      newMed.name.trim() &&
      newMed.dose.trim() &&
      newMed.frequency &&
      newMed.route
    ) {
      updateFormData({
        medications: [...formData.medications, { ...newMed }],
      });
      setNewMed(emptyMedication);
    }
  };

  const removeMedication = (index: number) => {
    updateFormData({
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">
          Medications
        </h2>
        <p className="text-lg font-medium text-neutral-500">
          List any current medications to help us identify contraindications.
        </p>
      </div>

      {/* Add new medication form */}
      <div className="space-y-5 rounded-xl bg-muted/30 p-4">
        <p className="text-sm font-semibold text-foreground">Add medication</p>

        <div className="grid grid-cols-2 gap-5">
          <IntakeInput
            type="text"
            value={newMed.name}
            onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            placeholder="Medication name"
          />
          <IntakeInput
            type="text"
            value={newMed.dose}
            onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
            placeholder="Dose (e.g., 10mg)"
          />
          <IntakeSelect
            value={newMed.frequency}
            onChange={(e) =>
              setNewMed({ ...newMed, frequency: e.target.value })
            }
          >
            <option value="">Select frequency</option>
            <option value="once daily">Once daily</option>
            <option value="twice daily">Twice daily</option>
            <option value="three times daily">Three times daily</option>
            <option value="four times daily">Four times daily</option>
            <option value="as needed">As needed</option>
            <option value="weekly">Weekly</option>
          </IntakeSelect>
          <IntakeSelect
            value={newMed.route}
            onChange={(e) => setNewMed({ ...newMed, route: e.target.value })}
          >
            <option value="">Select route</option>
            <option value="oral">Oral</option>
            <option value="topical">Topical</option>
            <option value="injection">Injection</option>
            <option value="inhalation">Inhalation</option>
            <option value="sublingual">Sublingual</option>
            <option value="rectal">Rectal</option>
          </IntakeSelect>
        </div>


      </div>

      {/* Medications list */}
      <div>
        <p className="mb-5 text-sm font-medium text-foreground">
          Current medications ({formData.medications.length})
        </p>

        {formData.medications.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No medications added. If you don&apos;t take any, you can proceed to
            the next step.
          </p>
        ) : (
          <div className="space-y-2">
            {formData.medications.map((med, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {med.dose} • {med.frequency} • {med.route}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => removeMedication(index)}
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
