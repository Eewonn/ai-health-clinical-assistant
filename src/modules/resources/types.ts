export type ChunkInput = {
  content: string;
  pageNumber?: number | null;
};

export type EmbeddedChunk = ChunkInput & {
  embedding: number[];
};

export type StoredChunk = {
  id: string;
  resource_id: string;
  chunk: string;
  page_number?: number | null;
  embedding?: number[];
};

export type SearchMatch = {
  chunkId: string;
  resourceId: string;
  chunk: string;
  pageNumber?: number | null;
  score: number;
};

export type ResourceIngestResult = {
  resourceId: string;
  chunkCount: number;
};
