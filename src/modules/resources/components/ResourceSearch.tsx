"use client";

import * as React from "react";
import { Button } from "@/modules/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/components/card";
import { Input } from "@/modules/ui/components/input";
import { Label } from "@/modules/ui/components/label";
import { Textarea } from "@/modules/ui/components/textarea";
import { SearchMatch } from "../types";
import { ApiResponse } from "@/lib/types";
import { Badge } from "@/modules/ui/components/badge";

export function ResourceSearch() {
  const [query, setQuery] = React.useState("");
  const [topK, setTopK] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchMatch[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch("/api/resource/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK }),
      });

      const data: ApiResponse<SearchMatch[]> = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to search resources.");
      }

      if (data.data) {
        setResults(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full border-none shadow-none md:border md:shadow-sm">
      <CardHeader>
        <CardTitle>Search Resources</CardTitle>
        <CardDescription>
          Query with vector search + LLM reranking for accurate results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="query">Query</Label>
            <Textarea
              id="query"
              placeholder="Enter your medical question or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topK">Results Limit (Top K)</Label>
            <Input
              id="topK"
              type="number"
              min={1}
              max={20}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
            />
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? "Searching & Reranking..." : "Search"}
        </Button>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Results</h3>
            <Badge variant="secondary">{results.length} found</Badge>
          </div>
          
          {results.length === 0 && !isLoading && !error && (
            <div className="flex h-[100px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              No results found yet.
            </div>
          )}
          
          <div className="grid gap-4">
            {results.map((match, index) => (
              <Card 
                key={`${match.chunkId}-${index}`} 
                className={index === 0 ? "border-primary/50 bg-accent/50" : "bg-card"}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "outline"}>
                         {match.score}/10
                      </Badge>
                      {index === 0 && <span className="font-medium text-primary">Best Match</span>}
                    </div>
                    <span>Page {match.pageNumber ?? "N/A"}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{match.chunk}</p>
                  <div className="text-xs text-muted-foreground/60 font-mono truncate">
                    ID: {match.chunkId}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
