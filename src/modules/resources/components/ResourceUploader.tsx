"use client";

import * as React from "react";
import { Button } from "@/modules/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/components/card";
import { Input } from "@/modules/ui/components/input";
import { Label } from "@/modules/ui/components/label";
import { ResourceIngestResult } from "../types";
import { ApiResponse } from "@/lib/types";
import { Badge } from "@/modules/ui/components/badge";

export function ResourceUploader() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ResourceIngestResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resource", {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse<ResourceIngestResult> = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to upload PDF.");
      }

      if (data.data) {
        setResult(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none md:border md:shadow-sm">
      <CardHeader>
        <CardTitle>Upload Resource</CardTitle>
        <CardDescription>
          Upload a PDF to ingest it into the RAG system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="pdf-upload">PDF File</Label>
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="cursor-pointer file:text-foreground"
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900/20 dark:text-green-300">
            <div className="flex items-center gap-2 mb-2">
               <Badge className="bg-green-600 hover:bg-green-700">Success</Badge>
               <span className="font-medium">Ingestion Complete</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
                <span className="text-green-800/80 dark:text-green-400">Resource ID:</span>
                <span className="font-mono truncate">{result.resourceId}</span>
                <span className="text-green-800/80 dark:text-green-400">Chunks:</span>
                <span>{result.chunkCount}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full"
        >
          {isLoading ? "Uploading..." : "Upload PDF"}
        </Button>
      </CardContent>
    </Card>
  );
}
