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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      treatment_plan,
      status,
      rejection_reason,
      reviewer_name,
      reviewer_notes,
      action, // "approved" | "rejected" | "edited"
    } = body;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Analysis ID is required" },
        { status: 400 }
      );
    }

    // 1. Update the analysis record
    const updateData: any = {};
    if (treatment_plan) updateData.treatment_plan = treatment_plan;
    if (status) updateData.status = status;
    if (rejection_reason !== undefined) updateData.rejection_reason = rejection_reason;

    const { data: updatedAnalysis, error: updateError } = await supabase
      .from("ai_analysis_results")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating analysis:", updateError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Failed to update analysis" },
        { status: 500 }
      );
    }

    // 2. Create Audit Log if action is provided
    if (action && reviewer_name) {
      const { error: auditError } = await supabase.from("audit_logs").insert({
        intake_id: updatedAnalysis.intake_id,
        action,
        reviewer_name,
        reviewer_notes,
      });

      if (auditError) {
        console.error("Error creating audit log:", auditError);
        // We don't fail the whole request if audit log fails, but we log it
      }
    }

    return NextResponse.json<ApiResponse<AIAnalysisResult>>({
      success: true,
      data: updatedAnalysis as AIAnalysisResult,
    });
  } catch (error) {
    console.error("Error updating analysis:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
