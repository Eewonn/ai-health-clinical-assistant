import OpenAI from "openai";
import { EMBEDDING_MODEL } from "../constants";
import { ChunkInput, EmbeddedChunk } from "../types";

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error("Missing OPENAI_API_KEY for embeddings.");
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export async function embedChunks(
  chunks: ChunkInput[]
): Promise<EmbeddedChunk[]> {
  if (!chunks.length) {
    return [];
  }

  const inputs = chunks.map((c) => c.content);

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: inputs,
  });

  return response.data.map((item, index) => ({
    content: chunks[index].content,
    pageNumber: chunks[index].pageNumber ?? null,
    embedding: item.embedding,
  }));
}

export async function embedQuery(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: [text],
  });

  const first = response.data[0];
  if (!first) {
    throw new Error("Failed to generate embedding for query.");
  }

  return first.embedding;
}
