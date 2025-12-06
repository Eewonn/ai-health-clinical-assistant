"use client";

import { PatientIntakeInput } from "@/lib/types";
import { calculateBMI } from "@/lib/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/ui/components/card";
import { Badge } from "@/modules/ui/components/badge";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
}

export default function ReviewStep({ formData }: Props) {
  const bmi =
    formData.height_cm > 0 && formData.weight_kg > 0
      ? calculateBMI(formData.height_cm, formData.weight_kg)
      : 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Review your information</h2>
        <p className="text-sm text-muted-foreground">
          Make sure everything looks correct before submitting.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-muted-foreground">Name</div>
          <div className="font-medium text-foreground">{formData.name || "-"}</div>
          <div className="text-muted-foreground">Age</div>
          <div className="font-medium text-foreground">{formData.age || "-"}</div>
          <div className="text-muted-foreground">Sex</div>
          <div className="font-medium text-foreground">{formData.sex || "-"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Health metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-muted-foreground">Height</div>
          <div className="font-medium text-foreground">{formData.height_cm} cm</div>
          <div className="text-muted-foreground">Weight</div>
          <div className="font-medium text-foreground">{formData.weight_kg} kg</div>
          <div className="text-muted-foreground">BMI</div>
          <div className="font-medium text-foreground">{bmi || "--"}</div>
          <div className="text-muted-foreground">Blood pressure</div>
          <div className="font-medium text-foreground">
            {formData.blood_pressure || "-"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lifestyle</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-muted-foreground">Exercise</div>
          <div className="font-medium text-foreground">{formData.lifestyle.exercise || "-"}</div>
          <div className="text-muted-foreground">Sleep</div>
          <div className="font-medium text-foreground">{formData.lifestyle.sleep_hours} hours</div>
          <div className="text-muted-foreground">Smoking</div>
          <div className="font-medium text-foreground">
            {formData.lifestyle.smoking ? "Yes" : "No"}
          </div>
          <div className="text-muted-foreground">Alcohol</div>
          <div className="font-medium text-foreground">{formData.lifestyle.alcohol || "-"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground">Conditions:</span>
            {formData.medical_history.conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.medical_history.conditions.map((condition, i) => (
                  <Badge key={i} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">None</span>
            )}
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground">Allergies:</span>
            {formData.medical_history.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.medical_history.allergies.map((allergy, i) => (
                  <Badge key={i} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">None</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {formData.medications.length > 0 ? (
            formData.medications.map((med, index) => (
              <div key={index} className="rounded-md border bg-muted/40 px-3 py-2">
                <span className="font-semibold text-foreground">{med.name}</span>{" "}
                <span className="text-muted-foreground">
                  {med.dose} • {med.frequency} • {med.route}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No medications</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Primary complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-foreground">
            {formData.primary_complaint.replace(/_/g, " ").replace(/\b\w/g, (l) =>
              l.toUpperCase()
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
