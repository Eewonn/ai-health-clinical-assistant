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
6.  **Generate Rationale & Citations**: Provide a clear rationale for your analysis and cite reputable medical sources (like PubMed, UpToDate, or major health organization guidelines) to support your key findings.

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
  flagged_issues: {
    drug_interactions: string[];
    contraindications: string[];
    warnings: string[]; // For high-risk metrics or other general concerns.
  };
  summary: string; // A concise summary for the clinician.
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
          content: JSON.stringify(intakeData, null, 2),
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
