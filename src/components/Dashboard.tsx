"use client";

import { AIAnalysisResult } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/modules/ui/components/button";
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

export default function Dashboard({ result }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const getRiskDescription = (level: string) => {
    switch (level) {
      case "high":
        return "High risk detected. Immediate attention required.";
      case "medium":
        return "Moderate risk. Monitor closely and consider interventions.";
      default:
        return "Low risk. Standard care recommended.";
    }
  };

  const getRiskBadgeVariant = (level: string) => {
      switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary"; // or warning if available, but secondary is neutral/safe
      default:
        return "outline";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Dashboard</h1>
          <p className="text-muted-foreground">
            Summary, risk, and flagged issues at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel edit" : "Edit plan"}
          </Button>
          <Button>Approve plan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Panel 1: Treatment Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Treatment Plan</CardTitle>
            <CardDescription>
              Recommended medications, lifestyle changes, and referrals.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Medications</h3>
              {result.treatment_plan.medications.length > 0 ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.treatment_plan.medications.map((med, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                      {med}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No medications prescribed</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Lifestyle</h3>
              {result.treatment_plan.lifestyle_changes.length > 0 ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.treatment_plan.lifestyle_changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                      {change}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No lifestyle changes</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Referrals</h3>
              {result.treatment_plan.referrals.length > 0 ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.treatment_plan.referrals.map((ref, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                      {ref}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No referrals needed</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Panel 2: Risk Indicator */}
        <Card className="flex flex-col justify-center bg-muted/10">
          <CardHeader className="pb-2">
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Patient safety score and risk level</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 py-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <Badge
                variant={getRiskBadgeVariant(result.risk_level)}
                className="px-3 py-1 text-sm uppercase"
              >
                {result.risk_level} Risk
              </Badge>
              <p className="text-xs text-muted-foreground px-4">
                {getRiskDescription(result.risk_level)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                 <span className="text-5xl font-bold tracking-tight">{result.safety_score}</span>
                 <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-1">Safety Score</p>
            </div>
          </CardContent>
        </Card>

        {/* Panel 3: Flagged Issues */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Flagged Issues</CardTitle>
            <CardDescription>
              Interactions, contraindications, and warnings surfaced by the model.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {result.flagged_issues.drug_interactions.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <h3 className="mb-2 text-sm font-semibold text-destructive flex items-center gap-2">
                    Interactions
                </h3>
                <ul className="space-y-1 text-sm text-destructive/90">
                  {result.flagged_issues.drug_interactions.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.flagged_issues.contraindications.length > 0 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
                <h3 className="mb-2 text-sm font-semibold text-orange-700 dark:text-orange-400">Contraindications</h3>
                <ul className="space-y-1 text-sm text-orange-700/90 dark:text-orange-400/90">
                  {result.flagged_issues.contraindications.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.flagged_issues.warnings.length > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
                <h3 className="mb-2 text-sm font-semibold text-yellow-700 dark:text-yellow-400">Warnings</h3>
                <ul className="space-y-1 text-sm text-yellow-700/90 dark:text-yellow-400/90">
                  {result.flagged_issues.warnings.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.flagged_issues.drug_interactions.length === 0 &&
             result.flagged_issues.contraindications.length === 0 &&
             result.flagged_issues.warnings.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                <p>No critical issues flagged</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
