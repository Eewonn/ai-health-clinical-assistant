"use client";

import { AIAnalysisResult } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/ui/components/card";
import { Badge } from "@/modules/ui/components/badge";

interface Props {
  result: AIAnalysisResult;
}

export default function AnalysisResult({ result }: Props) {
  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="space-y-0">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Analysis Results</CardTitle>
        <CardDescription>Clinician summary, risks, and suggested plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-xl border bg-muted/20 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Risk Level</p>
            <Badge
              className="px-3 py-1 text-sm uppercase"
              variant={getRiskBadgeVariant(result.risk_level)}
            >
              {result.risk_level}
            </Badge>
          </div>
          <div className="rounded-xl border bg-muted/20 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Safety Score</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold tracking-tight">{result.safety_score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </div>

        {/* Clinician Summary */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight">Clinician Summary</h3>
          <div className="rounded-lg border bg-card p-4 text-sm leading-relaxed shadow-sm">
            {result.summary}
          </div>
        </div>

        {/* Flagged Issues */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight">Flagged Issues</h3>
          <div className="space-y-3">
            {result.flagged_issues.drug_interactions.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
                    Drug Interactions
                </h4>
                <ul className="ml-4 mt-2 list-disc space-y-1 text-sm text-destructive/90">
                  {result.flagged_issues.drug_interactions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.flagged_issues.contraindications.length > 0 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
                <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400">Contraindications</h4>
                <ul className="ml-4 mt-2 list-disc space-y-1 text-sm text-orange-700/90 dark:text-orange-400/90">
                  {result.flagged_issues.contraindications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.flagged_issues.warnings.length > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
                <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Warnings</h4>
                <ul className="ml-4 mt-2 list-disc space-y-1 text-sm text-yellow-700/90 dark:text-yellow-400/90">
                  {result.flagged_issues.warnings.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.flagged_issues.drug_interactions.length === 0 &&
              result.flagged_issues.contraindications.length === 0 &&
              result.flagged_issues.warnings.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No critical issues flagged.</p>
              )}
          </div>
        </div>

        {/* Treatment Plan */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Suggested Treatment Plan</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {result.treatment_plan.medications.length > 0 && (
              <div className="rounded-lg border bg-muted/10 p-4">
                <h4 className="font-semibold text-sm mb-2">Medications</h4>
                <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                  {result.treatment_plan.medications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.treatment_plan.lifestyle_changes.length > 0 && (
              <div className="rounded-lg border bg-muted/10 p-4">
                <h4 className="font-semibold text-sm mb-2">Lifestyle Changes</h4>
                <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                  {result.treatment_plan.lifestyle_changes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.treatment_plan.referrals.length > 0 && (
              <div className="rounded-lg border bg-muted/10 p-4">
                <h4 className="font-semibold text-sm mb-2">Referrals</h4>
                <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                  {result.treatment_plan.referrals.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Citations */}
        {result.citations.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">References & Citations</h3>
            <ul className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
              {result.citations.map((citation, i) => (
                <li key={i}>
                  <a
                    href={citation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline"
                  >
                    {citation}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
