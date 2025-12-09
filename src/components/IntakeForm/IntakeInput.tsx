import { Input, InputProps } from "@/modules/ui/components/input";
import { cn } from "@/lib/utils";
import { forwardRef, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

// Custom Input for Intake Form - Wrapper to handle number stepper styled
export const IntakeInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // We need a local ref to manipulate value if it's a number input
    // If consumer passes a ref, we'll need to merge or just rely on native event triggering
    const internalRef = useRef<HTMLInputElement>(null);

    const handleStep = (step: number) => {
      const input = internalRef.current;
      if (!input) return;

      const currentValue = parseFloat(input.value) || 0;
      // Default step 1, or read from props if passed (casted to any for strictness avoidance)
      const stepVal = parseFloat((props as any).step) || 1;
      const minVal = (props as any).min ? parseFloat((props as any).min) : -Infinity;
      const maxVal = (props as any).max ? parseFloat((props as any).max) : Infinity;

      let newValue = currentValue + step * stepVal;

      // Clamp
      if (newValue < minVal) newValue = minVal;
      if (newValue > maxVal) newValue = maxVal;

      // Update value using setter to trigger React (hacky for uncontrolled but works for standard)
      // For controlled components in parent, we must trigger a change event
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(input, newValue);

      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    };

    const isNumber = type === "number";

    return (
      <div className="relative w-full">
        <Input
          ref={ref || internalRef}
          type={type}
          className={cn(
            "rounded-xl border-2 border-[#e5e5e5] shadow-none text-lg font-medium h-14",
            isNumber && "pr-12", // Make room for spinners
            className
          )}
          {...props}
        />
        {isNumber && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col border-l border-gray-200 pl-2 gap-1 h-3/5 justify-between">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => handleStep(1)}
              className="group flex flex-1 items-center justify-center rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-6 h-6 transition-colors"
            >
              <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => handleStep(-1)}
              className="group flex flex-1 items-center justify-center rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-6 h-6 transition-colors"
            >
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        )}
      </div>
    );
  }
);
IntakeInput.displayName = "IntakeInput";
