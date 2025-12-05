import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiResponse, AIAnalysisResult } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Analysis ID is required" },
        { status: 400 }
      );
    }

    const { data: analysis, error } = await supabase
      .from("ai_analysis_results")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !analysis) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<AIAnalysisResult>>({
      success: true,
      data: analysis as AIAnalysisResult,
    });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
