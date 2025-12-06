import {
  DEFAULT_TOP_K,
  MAX_PDF_BYTES,
  RERANK_CANDIDATE_COUNT,
} from "../constants";
import {
  SearchMatch,
  ResourceIngestResult,
} from "../types";
import { chunkText, extractPdfText } from "./pdf";
import { embedChunks, embedQuery } from "./embeddings";
import { persistEmbeddedChunks } from "./vector-store";
import { searchSimilarChunks } from "./vector-search";
import { rerankChunks } from "./reranker";

function ensurePdf(file: File) {
  const isPdfMime = file.type === "application/pdf";
  const isPdfName = file.name?.toLowerCase().endsWith(".pdf");

  if (!isPdfMime && !isPdfName) {
    throw new Error("Only PDF uploads are supported.");
  }

  if (file.size > MAX_PDF_BYTES) {
    throw new Error("PDF exceeds maximum supported size.");
  }
}

export async function ingestResource(file: File): Promise<ResourceIngestResult> {
  ensurePdf(file);

  const arrayBuffer = await file.arrayBuffer();
  const text = await extractPdfText(arrayBuffer);
  const chunkInputs = chunkText(text);

  if (!chunkInputs.length) {
    throw new Error("No content chunks were produced from PDF.");
  }

  const resourceId = crypto.randomUUID();
  const embeddedChunks = await embedChunks(chunkInputs);
  const stored = await persistEmbeddedChunks(resourceId, embeddedChunks);

  if (stored.length !== embeddedChunks.length) {
    throw new Error("Mismatch between stored chunks and embeddings.");
  }

  return {
    resourceId,
    chunkCount: stored.length,
  };
}

export async function searchResources(
  query: string,
  topK: number = DEFAULT_TOP_K
): Promise<SearchMatch[]> {
  if (!query?.trim()) {
    throw new Error("Query is required.");
  }

  // Step 1: Vector search to get candidate chunks (fetch more for reranking)
  const candidateCount = Math.max(topK, RERANK_CANDIDATE_COUNT);
  const queryEmbedding = await embedQuery(query.trim());
  const { chunks } = await searchSimilarChunks(queryEmbedding, candidateCount);

  if (!chunks.length) {
    return [];
  }

  // Step 2: Rerank using LLM for better accuracy
  const rerankedChunks = await rerankChunks(query.trim(), chunks, topK);

  return rerankedChunks.map((chunk) => ({
    chunkId: chunk.id,
    resourceId: chunk.resource_id,
    chunk: chunk.chunk,
    pageNumber: chunk.page_number ?? null,
    score: chunk.relevanceScore,
  }));
}
