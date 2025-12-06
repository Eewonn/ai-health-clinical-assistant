import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";
import { DEFAULT_TOP_K } from "@/modules/resources/constants";
import { searchResources } from "@/modules/resources/services/rag";
import { SearchMatch } from "@/modules/resources/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SearchMatch[] | null>>> {
  try {
    const body = await request.json();
    const query = body?.query as string | undefined;
    const topKInput = Number(body?.topK ?? DEFAULT_TOP_K);
    const topK = Number.isFinite(topKInput)
      ? Math.max(1, Math.min(topKInput, 20))
      : DEFAULT_TOP_K;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "query is required" },
        { status: 400 }
      );
    }

    const results = await searchResources(query, topK);

    return NextResponse.json(
        { success: true, data: results },
        { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search resources.";

    return NextResponse.json(
      { success: false, error: message },
      { status: message?.includes("Failed") ? 500 : 400 }
    );
  }
}
