import { NextRequest, NextResponse } from "next/server";
import { ingestResource } from "@/modules/resources/services/rag";
import { ApiResponse } from "@/lib/types";
import { ResourceIngestResult } from "@/modules/resources/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ResourceIngestResult | null>>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Missing PDF file upload." },
        { status: 400 }
      );
    }

    const result = await ingestResource(file);

    return NextResponse.json(
        { success: true, data: result },
        { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to ingest resource.";

    return NextResponse.json(
      { success: false, error: message },
      { status: message?.includes("Failed") ? 500 : 400 }
    );
  }
}
