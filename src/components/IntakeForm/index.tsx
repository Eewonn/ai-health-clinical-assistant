"use client";

import { useState } from "react";
import { PatientIntakeInput, PatientIntake } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import MetricsStep from "./steps/MetricsStep";
import LifestyleStep from "./steps/LifestyleStep";
import MedicalHistoryStep from "./steps/MedicalHistoryStep";
import MedicationsStep from "./steps/MedicationsStep";
import ComplaintStep from "./steps/ComplaintStep";
import ReviewStep from "./steps/ReviewStep";

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
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <MetricsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <LifestyleStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <MedicalHistoryStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <MedicationsStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ComplaintStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Patient Intake Form</h1>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={`flex-1 text-center text-xs ${
                index <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">
          Step {currentStep + 1}: {STEPS[currentStep]}
        </p>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {renderStep()}
      </div>

      {/* Submit Result Message */}
      {submitError && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-800">
          {submitError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit & Analyze"}
          </button>
        )}
      </div>
    </div>
  );
}
