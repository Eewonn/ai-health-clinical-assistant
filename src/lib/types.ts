// Database Types

export type UserRole = "clinician" | "consumer";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Lifestyle JSONB structure
export interface Lifestyle {
  exercise: string; // e.g., "none", "light", "moderate", "heavy"
  sleep_hours: number;
  smoking: boolean;
  alcohol: string; // e.g., "none", "occasional", "moderate", "heavy"
}

// Medical History JSONB structure
export interface MedicalHistory {
  conditions: string[];
  allergies: string[];
}

// Medication JSONB structure
export interface Medication {
  name: string;
  dose: string;
  frequency: string; // e.g., "once daily", "twice daily"
  route: string; // e.g., "oral", "topical", "injection"
}

// Primary complaint options
export type PrimaryComplaint =
  | "erectile_dysfunction"
  | "hair_loss"
  | "weight_loss"
  | "fatigue"
  | "anxiety"
  | "depression"
  | "sleep_issues"
  | "other";

// Patient Intake form data
export interface PatientIntake {
  id: string;
  user_id: string;
  name: string;
  age: number;
  sex: "male" | "female" | "other";
  height_cm: number;
  weight_kg: number;
  bmi: number;
  blood_pressure: string; // e.g., "120/80"
  lifestyle: Lifestyle;
  medical_history: MedicalHistory;
  medications: Medication[];
  primary_complaint: PrimaryComplaint;
  full_body_image?: string;
  intake_date: string;
}

// Input type for creating patient intake (without auto-generated fields)
export interface PatientIntakeInput {
  user_id: string;
  name: string;
  age: number;
  sex: "male" | "female" | "other";
  height_cm: number;
  weight_kg: number;
  blood_pressure: string;
  lifestyle: Lifestyle;
  medical_history: MedicalHistory;
  medications: Medication[];
  primary_complaint: PrimaryComplaint;
  full_body_image?: string;
}

// AI Analysis Results
export type RiskLevel = "low" | "medium" | "high";

export interface TreatmentPlan {
  medications: string[];
  lifestyle_changes: string[];
  referrals: string[];
}

export interface FlaggedIssues {
  drug_interactions: string[];
  contraindications: string[];
  warnings: string[];
}

// Meal Plan Structure
export interface MealPlan {
  category: "Low Carb" | "High Protein" | "Heart-Friendly" | "Balanced";
  reasoning: string; // Changed from suggestion to reasoning
}

export interface GoRockyRecommendation {
  product: "GoRocky" | "GoFuller" | "GoSlim";
  reasoning: string;
}

export interface AIAnalysisResult {
  id: string;
  intake_id: string;
  risk_level: RiskLevel;
  safety_score: number; // 0-100
  treatment_plan: TreatmentPlan;
  meal_plan: MealPlan;
  gorocky_recommendation?: GoRockyRecommendation; // New conditional field
  flagged_issues: FlaggedIssues;
  summary: string;
  visual_summary?: string;
  research_summary?: string;
  citations: string[];
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  intake_id: string;
  action: "approved" | "rejected" | "edited";
  reviewer_name: string;
  reviewer_notes?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
