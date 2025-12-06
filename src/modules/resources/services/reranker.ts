import OpenAI from "openai";
import { RERANK_MODEL } from "../constants";
import { StoredChunk } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RankedChunk = StoredChunk & {
  relevanceScore: number;
};

/**
 * Rerank chunks using an LLM to determine relevance to the query.
 * Returns chunks sorted by relevance (highest first).
 */
export async function rerankChunks(
  query: string,
  chunks: StoredChunk[],
  topK: number
): Promise<RankedChunk[]> {
  if (!chunks.length) {
    return [];
  }

  // Build prompt with numbered chunks
  const chunkList = chunks
    .map((chunk, i) => `[${i + 1}] ${chunk.chunk}`)
    .join("\n\n");

  const prompt = `You are a relevance scoring assistant. Given a query and a list of text chunks, rate each chunk's relevance to answering the query.

Query: "${query}"

Text chunks:
${chunkList}

For each chunk, provide a relevance score from 0 to 10:
- 10: Directly and completely answers the query
- 7-9: Contains the answer or highly relevant information
- 4-6: Somewhat relevant, provides context
- 1-3: Marginally relevant
- 0: Not relevant at all

Respond with ONLY a JSON array of objects with "index" (1-based) and "score" fields, ordered by score descending.
Example: [{"index": 2, "score": 9}, {"index": 1, "score": 4}]`;

  try {
    const response = await openai.chat.completions.create({
      model: RERANK_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      // Fallback: return original order
      return chunks.slice(0, topK).map((c) => ({ ...c, relevanceScore: 0 }));
    }

    // Parse response - handle both array and object with "results" key
    let scores: Array<{ index: number; score: number }>;
    const parsed = JSON.parse(content);
    
    if (Array.isArray(parsed)) {
      scores = parsed;
    } else if (parsed.results && Array.isArray(parsed.results)) {
      scores = parsed.results;
    } else if (parsed.rankings && Array.isArray(parsed.rankings)) {
      scores = parsed.rankings;
    } else {
      // Try to find any array in the response
      const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
      scores = arrayKey ? parsed[arrayKey] : [];
    }

    // Map scores back to chunks and sort
    const rankedChunks: RankedChunk[] = scores
      .filter((s) => s.index >= 1 && s.index <= chunks.length)
      .map((s) => ({
        ...chunks[s.index - 1],
        relevanceScore: s.score,
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, topK);

    // Add any missing chunks with score 0
    if (rankedChunks.length < topK) {
      const includedIds = new Set(rankedChunks.map((c) => c.id));
      for (const chunk of chunks) {
        if (!includedIds.has(chunk.id) && rankedChunks.length < topK) {
          rankedChunks.push({ ...chunk, relevanceScore: 0 });
        }
      }
    }

    return rankedChunks;
  } catch (error) {
    console.error("Reranking failed, returning original order:", error);
    return chunks.slice(0, topK).map((c) => ({ ...c, relevanceScore: 0 }));
  }
}
