export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSION = 1536;

export const CHUNK_SIZE = 500;
export const CHUNK_OVERLAP = 100;

// Reranking config
export const RERANK_CANDIDATE_COUNT = 10; // Fetch more candidates for reranking
export const RERANK_MODEL = "gpt-4o-mini";
export const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15MB safety cap

export const RESOURCE_CHUNKS_TABLE = "resource_chunks";

export const DEFAULT_TOP_K = 5;
