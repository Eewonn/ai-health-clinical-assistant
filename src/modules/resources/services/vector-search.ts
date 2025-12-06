import { supabaseAdmin } from "@/lib/supabase-admin";
import { RESOURCE_CHUNKS_TABLE } from "../constants";
import { StoredChunk } from "../types";

/**
 * Search for similar chunks using Supabase pgvector.
 * Uses the <-> operator for L2 distance (requires pgvector extension).
 */
export async function searchSimilarChunks(
  queryEmbedding: number[],
  topK: number
): Promise<{ chunks: StoredChunk[]; scores: number[] }> {
  // Convert embedding array to pgvector format string
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const { data, error } = await supabaseAdmin.rpc("match_resource_chunks", {
    query_embedding: embeddingStr,
    match_count: topK,
  });

  if (error) {
    throw new Error(`Vector search failed: ${error.message}`);
  }

  const chunks: StoredChunk[] = [];
  const scores: number[] = [];

  for (const row of data ?? []) {
    chunks.push({
      id: row.id,
      resource_id: row.resource_id,
      chunk: row.chunk,
      page_number: row.page_number,
    });
    scores.push(row.similarity ?? 0);
  }

  return { chunks, scores };
}
