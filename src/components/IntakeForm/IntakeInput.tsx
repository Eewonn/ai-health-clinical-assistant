import { Input, InputProps } from "@/modules/ui/components/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// Custom Input for Intake Form - Pill Shape, Taller, White, with Arrow Left
export const IntakeInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn("rounded-3xl border-gray-100 shadow-sm text-lg", className)}
      {...props}
    />
  ),
);
IntakeInput.displayName = "IntakeInput";
