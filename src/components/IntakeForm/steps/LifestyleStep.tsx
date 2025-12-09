import { cn } from "@/lib/utils";
import { PatientIntakeInput } from "@/lib/types";
import { IntakeInput } from "../IntakeInput";
import { IntakeSelect } from "../IntakeSelect";
import { Label } from "@/modules/ui/components/label";

interface Props {
  formData: Omit<PatientIntakeInput, "user_id">;
  updateFormData: (updates: Partial<Omit<PatientIntakeInput, "user_id">>) => void;
}

export default function LifestyleStep({ formData, updateFormData }: Props) {
  const updateLifestyle = (updates: Partial<typeof formData.lifestyle>) => {
    updateFormData({
      lifestyle: { ...formData.lifestyle, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-700">Lifestyle</h2>
        <p className="text-lg font-medium text-neutral-500">
          Your daily habits help us tailor recommendations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-5">
          <Label htmlFor="exercise" className="ml-4">Exercise level *</Label>
          <IntakeSelect
            id="exercise"
            value={formData.lifestyle.exercise}
            onChange={(e) => updateLifestyle({ exercise: e.target.value })}
          >
            <option value="">Select exercise level</option>
            <option value="none">None</option>
            <option value="light">Light (1-2 days/week)</option>
            <option value="moderate">Moderate (3-4 days/week)</option>
            <option value="heavy">Heavy (5+ days/week)</option>
          </IntakeSelect>
        </div>

        <div className="space-y-5">
          <Label htmlFor="sleep" className="ml-4">Average sleep hours *</Label>
          <IntakeInput
            id="sleep"
            type="number"
            value={formData.lifestyle.sleep_hours || ""}
            onChange={(e) =>
              updateLifestyle({ sleep_hours: parseFloat(e.target.value) || 0 })
            }
            placeholder="e.g., 7"
            min={0}
            max={24}
            step={0.5}
          />
        </div>

        <div className="space-y-3">
          <Label className="ml-4">Do you smoke? *</Label>
          <div className="flex w-full gap-4">
            <button
              type="button"
              onClick={() => updateLifestyle({ smoking: true })}
              className={cn(
                "flex-1 h-11 rounded-xl border-2 font-bold text-base transition-all",
                formData.lifestyle.smoking === true
                  ? "border-[#ff4b4b] bg-red-50 text-[#ff4b4b] shadow-none"
                  : "border-[#e5e5e5] bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600"
              )}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateLifestyle({ smoking: false })}
              className={cn(
                "flex-1 h-11 rounded-xl border-2 font-bold text-base transition-all",
                formData.lifestyle.smoking === false
                  ? "border-[#3E9001] bg-green-50 text-[#3E9001] shadow-none"
                  : "border-[#e5e5e5] bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600"
              )}
            >
              No
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <Label htmlFor="alcohol" className="ml-4">Alcohol consumption *</Label>
          <IntakeSelect
            id="alcohol"
            value={formData.lifestyle.alcohol}
            onChange={(e) => updateLifestyle({ alcohol: e.target.value })}
          >
            <option value="">Select alcohol consumption</option>
            <option value="none">None</option>
            <option value="occasional">Occasional (1-2 drinks/week)</option>
            <option value="moderate">Moderate (3-7 drinks/week)</option>
            <option value="heavy">Heavy (8+ drinks/week)</option>
          </IntakeSelect>
        </div>
      </div>
    </div>
  );
}
