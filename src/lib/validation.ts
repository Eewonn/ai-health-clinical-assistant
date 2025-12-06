import {
  PatientIntakeInput,
  ValidationError,
  Lifestyle,
  MedicalHistory,
  Medication,
} from "./types";

export function validatePatientIntake(
  data: Partial<PatientIntakeInput>
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required string fields
  if (!data.user_id?.trim()) {
    errors.push({ field: "user_id", message: "User ID is required" });
  }

  if (!data.name?.trim()) {
    errors.push({ field: "name", message: "Name is required" });
  }

  // Age validation
  if (data.age === undefined || data.age === null) {
    errors.push({ field: "age", message: "Age is required" });
  } else if (data.age < 0 || data.age > 150) {
    errors.push({ field: "age", message: "Age must be between 0 and 150" });
  }

  // Sex validation
  if (!data.sex) {
    errors.push({ field: "sex", message: "Sex is required" });
  } else if (!["male", "female", "other"].includes(data.sex)) {
    errors.push({
      field: "sex",
      message: "Sex must be male, female, or other",
    });
  }

  // Height validation
  if (data.height_cm === undefined || data.height_cm === null) {
    errors.push({ field: "height_cm", message: "Height is required" });
  } else if (data.height_cm < 30 || data.height_cm > 300) {
    errors.push({
      field: "height_cm",
      message: "Height must be between 30 and 300 cm",
    });
  }

  // Weight validation
  if (data.weight_kg === undefined || data.weight_kg === null) {
    errors.push({ field: "weight_kg", message: "Weight is required" });
  } else if (data.weight_kg < 1 || data.weight_kg > 700) {
    errors.push({
      field: "weight_kg",
      message: "Weight must be between 1 and 700 kg",
    });
  }

  // Blood pressure validation (Optional)
  if (data.blood_pressure?.trim() && !/^\d{2,3}\/\d{2,3}$/.test(data.blood_pressure)) {
    errors.push({
      field: "blood_pressure",
      message: "Blood pressure must be in format like 120/80",
    });
  }

  // Lifestyle validation
  if (!data.lifestyle) {
    errors.push({ field: "lifestyle", message: "Lifestyle information is required" });
  } else {
    const lifestyleErrors = validateLifestyle(data.lifestyle);
    errors.push(...lifestyleErrors);
  }

  // Medical history validation
  if (!data.medical_history) {
    errors.push({
      field: "medical_history",
      message: "Medical history is required",
    });
  } else {
    const historyErrors = validateMedicalHistory(data.medical_history);
    errors.push(...historyErrors);
  }

  // Medications validation (can be empty array but must exist)
  if (!data.medications) {
    errors.push({ field: "medications", message: "Medications field is required" });
  } else if (!Array.isArray(data.medications)) {
    errors.push({ field: "medications", message: "Medications must be an array" });
  } else {
    data.medications.forEach((med, index) => {
      const medErrors = validateMedication(med, index);
      errors.push(...medErrors);
    });
  }

  // Primary complaint validation
  if (!data.primary_complaint?.trim()) {
    errors.push({
      field: "primary_complaint",
      message: "Primary complaint is required",
    });
  }

  return errors;
}

function validateLifestyle(lifestyle: Partial<Lifestyle>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!lifestyle.exercise?.trim()) {
    errors.push({
      field: "lifestyle.exercise",
      message: "Exercise level is required",
    });
  }

  if (lifestyle.sleep_hours === undefined || lifestyle.sleep_hours === null) {
    errors.push({
      field: "lifestyle.sleep_hours",
      message: "Sleep hours is required",
    });
  } else if (lifestyle.sleep_hours < 0 || lifestyle.sleep_hours > 24) {
    errors.push({
      field: "lifestyle.sleep_hours",
      message: "Sleep hours must be between 0 and 24",
    });
  }

  if (lifestyle.smoking === undefined || lifestyle.smoking === null) {
    errors.push({
      field: "lifestyle.smoking",
      message: "Smoking status is required",
    });
  }

  if (!lifestyle.alcohol?.trim()) {
    errors.push({
      field: "lifestyle.alcohol",
      message: "Alcohol consumption level is required",
    });
  }

  return errors;
}

function validateMedicalHistory(
  history: Partial<MedicalHistory>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!history.conditions) {
    errors.push({
      field: "medical_history.conditions",
      message: "Conditions field is required (can be empty array)",
    });
  } else if (!Array.isArray(history.conditions)) {
    errors.push({
      field: "medical_history.conditions",
      message: "Conditions must be an array",
    });
  }

  if (!history.allergies) {
    errors.push({
      field: "medical_history.allergies",
      message: "Allergies field is required (can be empty array)",
    });
  } else if (!Array.isArray(history.allergies)) {
    errors.push({
      field: "medical_history.allergies",
      message: "Allergies must be an array",
    });
  }

  return errors;
}

function validateMedication(
  med: Partial<Medication>,
  index: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `medications[${index}]`;

  if (!med.name?.trim()) {
    errors.push({ field: `${prefix}.name`, message: "Medication name is required" });
  }

  if (!med.dose?.trim()) {
    errors.push({ field: `${prefix}.dose`, message: "Medication dose is required" });
  }

  if (!med.frequency?.trim()) {
    errors.push({
      field: `${prefix}.frequency`,
      message: "Medication frequency is required",
    });
  }

  if (!med.route?.trim()) {
    errors.push({ field: `${prefix}.route`, message: "Medication route is required" });
  }

  return errors;
}

// Calculate BMI from height (cm) and weight (kg)
export function calculateBMI(height_cm: number, weight_kg: number): number {
  const height_m = height_cm / 100;
  const bmi = weight_kg / (height_m * height_m);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
}
