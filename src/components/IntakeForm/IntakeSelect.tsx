import { cn } from "@/lib/utils";
import React, {
    forwardRef,
    useState,
    useRef,
    useEffect,
    ReactElement,
} from "react";

export interface SelectProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
    value?: string | number | readonly string[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    name?: string;
    form?: string;
}

export const IntakeSelect = forwardRef<HTMLButtonElement, SelectProps>(
    ({ className, children, value, onChange, placeholder, id, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        // Extract options from children
        const options = React.Children.toArray(children)
            .filter((child): child is ReactElement => React.isValidElement(child))
            .map((child) => {
                const c = child as ReactElement<{ value: string; children: React.ReactNode }>;
                return {
                    value: c.props.value,
                    label: c.props.children,
                };
            });

        const selectedOption = options.find((opt) => opt.value === value);

        // Handle click outside to close
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        const handleSelect = (newValue: string) => {
            if (onChange) {
                // Simulate native event
                const event = {
                    target: { value: newValue, name: props.name, id: id },
                    currentTarget: { value: newValue, name: props.name, id: id },
                } as unknown as React.ChangeEvent<HTMLSelectElement>;
                onChange(event);
            }
            setIsOpen(false);
        };

        return (
            <div className="relative w-full" ref={containerRef}>
                <button
                    type="button"
                    ref={ref}
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex h-14 w-full items-center justify-between rounded-xl border-2 border-[#e5e5e5] bg-white px-5 text-lg font-medium font-sans shadow-none transition-all focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 text-left",
                        !selectedOption ? "text-gray-400" : "text-gray-900",
                        className
                    )}
                    {...props} // pass other props mainly for aria or data attributes if any
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder || "Select..."}
                    </span>
                    <div className="pointer-events-none text-gray-400">
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
                            className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute left-0 top-full z-50 mt-4 w-full rounded-xl border-2 border-[#e5e5e5] bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Arrow/Triangle pointing up */}
                        <div className="absolute -top-[9px] right-6 h-4 w-4 rotate-45 border-l-2 border-t-2 border-[#e5e5e5] bg-white content-['']" />

                        <div className="max-h-[300px] overflow-auto py-1">
                            {options.map((option, index) => (
                                <div
                                    key={`${option.value}-${index}`}
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        "relative cursor-pointer select-none rounded-lg px-4 py-3 text-lg font-medium outline-none transition-colors hover:bg-slate-50 hover:text-gray-900",
                                        option.value === value
                                            ? "bg-slate-50 text-gray-900"
                                            : "text-gray-600"
                                    )}
                                >
                                    {/* Checkmark if selected */}
                                    <div className="flex items-center justify-between">
                                        <span>{option.label}</span>
                                        {option.value === value && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#3E9001]"><polyline points="20 6 9 17 4 12" /></svg>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);
IntakeSelect.displayName = "IntakeSelect";
