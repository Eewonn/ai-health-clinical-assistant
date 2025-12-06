import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validatePatientIntake, calculateBMI } from "@/lib/validation";
import { PatientIntakeInput, ApiResponse, PatientIntake } from "@/lib/types";

// POST - Create new patient intake
export async function POST(request: NextRequest) {
  try {
    const body: PatientIntakeInput = await request.json();

    // Validate input
    const validationErrors = validatePatientIntake(body);
    if (validationErrors.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Validation failed",
          data: null,
        },
        { status: 400 }
      );
    }

    // Calculate BMI
    const bmi = calculateBMI(body.height_cm, body.weight_kg);

    // Prepare data for insertion
    const intakeData = {
      user_id: body.user_id,
      name: body.name,
      age: body.age,
      sex: body.sex,
      height_cm: body.height_cm,
      weight_kg: body.weight_kg,
      bmi: bmi,
      blood_pressure: body.blood_pressure,
      lifestyle: body.lifestyle,
      medical_history: body.medical_history,
      medications: body.medications,
      primary_complaint: body.primary_complaint,
      full_body_image: body.full_body_image,
      intake_date: new Date().toISOString(),
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from("patient_intake")
      .insert(intakeData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Return structured JSON (ready for LLM processing)
    return NextResponse.json<ApiResponse<PatientIntake>>(
      {
        success: true,
        data: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve patient intakes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const intakeId = searchParams.get("id");

    let query = supabase.from("patient_intake").select("*");

    // Filter by specific intake ID
    if (intakeId) {
      query = query.eq("id", intakeId);
    }

    // Filter by user ID
    if (userId) {
      query = query.eq("user_id", userId);
    }

    // Order by most recent
    query = query.order("intake_date", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<PatientIntake[]>>(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
