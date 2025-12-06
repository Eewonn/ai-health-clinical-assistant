"use client";

import { useState } from "react";
import { PatientIntakeInput, PatientIntake } from "@/lib/types";
import { validatePatientIntake } from "@/lib/validation";
import { useAuth } from "@/lib/auth-context";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import MetricsStep from "./steps/MetricsStep";
import LifestyleStep from "./steps/LifestyleStep";
import MedicalHistoryStep from "./steps/MedicalHistoryStep";
import MedicationsStep from "./steps/MedicationsStep";
import ComplaintStep from "./steps/ComplaintStep";
import ReviewStep from "./steps/ReviewStep";
import { Button } from "@/modules/ui/components/button";
import { Progress } from "@/modules/ui/components/progress";

interface IntakeFormProps {
  onFormSubmit: (intakeData: PatientIntake) => void;
}

const STEPS = [
  "Personal Info",
  "Metrics",
  "Lifestyle",
  "Medical History",
  "Medications",
  "Primary Complaint",
  "Review",
];

const initialFormData: Omit<PatientIntakeInput, "user_id"> = {
  name: "",
  age: 0,
  sex: "male",
  height_cm: 0,
  weight_kg: 0,
  blood_pressure: "",
  lifestyle: {
    exercise: "",
    sleep_hours: 0,
    smoking: false,
    alcohol: "",
  },
  medical_history: {
    conditions: [],
    allergies: [],
  },
  medications: [],
  primary_complaint: "other",
};

export default function IntakeForm({ onFormSubmit }: IntakeFormProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("You must be signed in to submit the form.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: PatientIntakeInput = {
        ...formData,
        user_id: user.id,
      };

      // Client-side validation
      const validationErrors = validatePatientIntake(payload);
      if (validationErrors.length > 0) {
        setSubmitError(
          `Validation failed: ${validationErrors.map((e) => e.message).join(", ")}`
        );
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Pass the full intake data back to the parent page
        onFormSubmit(result.data);
      } else {
        setSubmitError(result.error || "Failed to submit form");
      }
    } catch (error) {
      setSubmitError("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <MetricsStep formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return (
          <LifestyleStep formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <MedicalHistoryStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <MedicationsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <ComplaintStep formData={formData} updateFormData={updateFormData} />
        );
      case 6:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 rounded-xl p-10 max-w-3xl mx-auto">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-[32px] font-extrabold tracking-tight text-neutral-700">
          Patient Intake
        </h1>
        <p className="text-lg font-medium text-neutral-500">
          Complete the steps below so the AI assistant can generate a clinical
          summary and treatment plan.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2 mt-20">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Step {currentStep + 1}</span>
          <span>{STEPS[currentStep]}</span>
          <span>
            {currentStep + 1}/{STEPS.length}
          </span>
        </div>
        <Progress value={((currentStep + 1) / STEPS.length) * 100} />
      </div>

      {/* Form Content */}
      <div className="rounded-xl bg-background p-6">{renderStep()}</div>

      {/* Submit Result Message */}
      {submitError && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center mt-20 justify-between pt-2">
        <Button
          className="h-[45px] w-[110px] rounded-xl border-2 border-[#e5e5e5] bg-white text-[13px] font-extrabold tracking-wider text-[#3E9001] shadow-[0_4px_0_#e5e5e5] transition hover:bg-slate-50 active:shadow-none active:translate-y-[4px] uppercase"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            className="h-[45px] w-[110px] rounded-xl bg-[#ff4b4b] text-[13px] font-extrabold tracking-widest text-white shadow-[0_4px_0_#ea2b2b] transition active:shadow-none active:translate-y-[4px] uppercase hover:bg-[#ff5c5c]"
            onClick={nextStep}
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit & Analyze"}
          </Button>
        )}
      </div>
    </div>
  );
}
