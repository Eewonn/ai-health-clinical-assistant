import { supabaseAdmin } from "@/lib/supabase-admin";
import { RESOURCE_CHUNKS_TABLE } from "../constants";
import { EmbeddedChunk, StoredChunk } from "../types";

export async function persistEmbeddedChunks(
  resourceId: string,
  chunks: EmbeddedChunk[]
): Promise<StoredChunk[]> {
  if (!chunks.length) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from(RESOURCE_CHUNKS_TABLE)
    .insert(
      chunks.map((chunk) => ({
        resource_id: resourceId,
        chunk: chunk.content,
        embedding: chunk.embedding,
        page_number: chunk.pageNumber ?? null,
      }))
    )
    .select("id, resource_id, chunk, page_number");

  if (error) {
    throw new Error(
      `Failed to persist embedded chunks to Supabase: ${error.message}`
    );
  }

  return data ?? [];
}

export async function fetchChunksByIds(
  ids: string[]
): Promise<StoredChunk[]> {
  if (!ids.length) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from(RESOURCE_CHUNKS_TABLE)
    .select("id, resource_id, chunk, page_number")
    .in("id", ids);

  if (error) {
    throw new Error(
      `Failed to load chunk metadata for ids: ${error.message}`
    );
  }

  return data ?? [];
}

export async function fetchAllChunkEmbeddings(): Promise<StoredChunk[]> {
  const { data, error } = await supabaseAdmin
    .from(RESOURCE_CHUNKS_TABLE)
    .select("id, resource_id, chunk, embedding, page_number");

  if (error) {
    throw new Error(
      `Failed to load chunk embeddings from Supabase: ${error.message}`
    );
  }

  return data ?? [];
}
