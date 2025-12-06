import OpenAI from "openai";
import { PatientIntake, AIAnalysisResult } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an expert AI Clinical Assistant. Your role is to perform a preliminary analysis of patient intake data for a licensed clinician to review. You are not a doctor and you are not providing a diagnosis. Your analysis must be cautious, evidence-based, and prioritize patient safety.

You will receive a JSON object with patient data. Your tasks are:
1.  **Analyze Health Risks**: Identify potential health risks based on the provided metrics, lifestyle, and medical history.
2.  **Check Drug Interactions**: Review the patient's medication list for potential drug-drug interactions.
3.  **Check Contraindications**: Check for contraindications between the patient's medications and their stated medical conditions or allergies.
4.  **Flag High-Risk Metrics**: Explicitly flag metrics that are outside of normal ranges (e.g., BMI > 30 or < 18.5, high/low blood pressure).
5.  **Suggest Treatment Plan**: Propose a preliminary, conservative treatment plan. This can include medication suggestions (use generic names), lifestyle changes, and potential specialist referrals.
6.  **Recommended Meal Plan**: Analyze the patient's health and select the most appropriate NuMeals program from these 4 categories: "Low Carb", "High Protein", "Heart-Friendly", or "Balanced". Provide a brief reasoning for why this specific program is best for them.
7.  **GoRocky Recommendation (Males Only)**: If the patient's sex is "male", recommend ONE of the following products based on their needs:
    - "GoFuller" (for hair loss concerns)
    - "GoSlim" (for weight management/high BMI)
    - "GoRocky" (for general male wellness, sexual health, or if no other specific fit)
    Provide a short reasoning. If the patient is NOT male, this field should be omitted or null.
8.  **Generate Rationale & Citations**: Provide a clear rationale for your analysis and cite reputable medical sources.
9.  **Research Summary**: Provide a detailed, evidence-based research summary that supports your clinical assessment and treatment plan. This should read like a mini-literature review relevant to the patient's specific case.

**Output Format**: You MUST respond with a single, valid JSON object. Do not include any text or markdown before or after the JSON object. The JSON object must strictly adhere to the following TypeScript interface:

\`\`\`typescript
interface AIAnalysisResult {
  risk_level: "low" | "medium" | "high";
  safety_score: number; // A score from 0-100, where 100 is the safest.
  treatment_plan: {
    medications: string[];
    lifestyle_changes: string[];
    referrals: string[];
  };
  meal_plan: {
    category: "Low Carb" | "High Protein" | "Heart-Friendly" | "Balanced";
    reasoning: string;
  };
  gorocky_recommendation?: {
    product: "GoRocky" | "GoFuller" | "GoSlim";
    reasoning: string;
  }; 
  flagged_issues: {
    drug_interactions: string[];
    contraindications: string[];
    warnings: string[]; // For high-risk metrics or other general concerns.
  };
  summary: string; // A concise summary for the clinician.
  visual_summary?: string; // A specific analysis of the full-body image if provided.
  research_summary?: string; // A detailed research summary supporting the diagnosis.
  citations: string[]; // An array of URL strings to the sources.
}
\`\`\`
`;

export async function analyzePatientData(
  intakeData: PatientIntake
): Promise<Omit<AIAnalysisResult, "id" | "intake_id" | "created_at">> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: JSON.stringify({ ...intakeData, full_body_image: undefined }, null, 2),
            },
            ...(intakeData.full_body_image
              ? [
                {
                  type: "image_url",
                  image_url: {
                    url: intakeData.full_body_image,
                  },
                },
              ]
              : []),
          ] as any,
        },
      ],
      response_format: { type: "json_object" },
    });

    const resultJson = response.choices[0].message.content;
    if (!resultJson) {
      throw new Error("OpenAI returned an empty response.");
    }

    // Parse and validate the response
    const analysisResult = JSON.parse(resultJson);
    return analysisResult;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to get analysis from OpenAI.");
  }
}
