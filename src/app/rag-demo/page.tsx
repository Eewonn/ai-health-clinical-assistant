import { ResourceUploader } from "@/modules/resources/components/ResourceUploader";
import { ResourceSearch } from "@/modules/resources/components/ResourceSearch";

export default function RagDemoPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">RAG System Demo</h1>
        <p className="text-muted-foreground">
          Upload medical PDFs and query them using semantic search (OpenAI Embeddings + FAISS).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="sticky top-20">
            <ResourceUploader />
          </div>
        </div>

        <div className="md:col-span-8">
          <ResourceSearch />
        </div>
      </div>
    </div>
  );
}
