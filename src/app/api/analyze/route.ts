import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzePatientData } from "@/lib/openai";
import { ApiResponse, AIAnalysisResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { intakeId } = await request.json();

    if (!intakeId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "intakeId is required" },
        { status: 400 }
      );
    }

    // 1. Fetch the patient intake data from Supabase
    const { data: intakeData, error: fetchError } = await supabase
      .from("patient_intake")
      .select("*")
      .eq("id", intakeId)
      .single();

    if (fetchError || !intakeData) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Patient intake not found" },
        { status: 404 }
      );
    }

    // 2. Send the data to the OpenAI service for analysis
    const analysisResult = await analyzePatientData(intakeData);

    // 3. Save the structured JSON output to the ai_analysis_results table
    const { data: savedAnalysis, error: saveError } = await supabase
      .from("ai_analysis_results")
      .insert({
        intake_id: intakeId,
        ...analysisResult,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving analysis to Supabase:", saveError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Failed to save analysis results" },
        { status: 500 }
      );
    }

    // 4. Return the final analysis result
    return NextResponse.json<ApiResponse<AIAnalysisResult>>(
      { success: true, data: savedAnalysis },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
