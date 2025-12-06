import pdfParse from "pdf-parse";
import { CHUNK_OVERLAP, CHUNK_SIZE } from "../constants";
import { ChunkInput } from "../types";

export async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfBuffer = Buffer.from(arrayBuffer);
  const parsed = await pdfParse(pdfBuffer);
  const text = parsed.text?.trim();

  if (!text) {
    throw new Error("Parsed PDF text is empty.");
  }

  return text;
}

export function chunkText(
  text: string,
  chunkSize = CHUNK_SIZE,
  overlap = CHUNK_OVERLAP
): ChunkInput[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  const chunks: ChunkInput[] = [];
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize);
    const slice = normalized.slice(start, end).trim();

    if (slice) {
      chunks.push({ content: slice });
    }

    if (end >= normalized.length) {
      break;
    }

    start = Math.max(0, end - overlap);
  }

  return chunks;
}
