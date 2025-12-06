import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export const IntakeSelect = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="relative w-full">
                <select
                    ref={ref}
                    className={cn(
                        "h-14 w-full appearance-none rounded-3xl border border-gray-100 bg-white px-5 text-lg font-medium font-sans shadow-sm transition-all focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        );
    }
);
IntakeSelect.displayName = "IntakeSelect";
