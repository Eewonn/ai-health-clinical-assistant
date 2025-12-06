import { Input, InputProps } from "@/modules/ui/components/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// Custom Input for Intake Form - Pill Shape, Taller, White, with Arrow Left
export const IntakeInput = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => (
        <div className="relative">
            <Input
                ref={ref}
                className={cn(
                    "h-14 rounded-2xl border-2 border-gray-100 bg-white pl-10 pr-6 text-base font-medium shadow-sm transition-all focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400",
                    className
                )}
                {...props}
            />
        </div>
    )
);
IntakeInput.displayName = "IntakeInput";
