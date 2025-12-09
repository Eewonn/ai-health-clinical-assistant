
import React from "react";

interface LoadingSpinnerProps {
    text?: string;
}

export default function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
    const dots = Array.from({ length: 12 });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="relative h-16 w-16">
                {dots.map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-1/2 top-0 h-full w-2.5 -translate-x-1/2 origin-center pt-0"
                        style={{ transform: `rotate(${i * 30}deg)` }}
                    >
                        <div
                            className="h-2.5 w-2.5 rounded-full bg-[#ff4b4b]"
                            style={{
                                animation: "spinner-fade 1.2s linear infinite",
                                animationDelay: `${-1.1 + (i * 0.1)}s`,
                            }}
                        />
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes spinner-fade {
                    0% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0.2; transform: scale(0.8); }
                }
            `}</style>

            <p className="mt-8 text-lg font-bold text-[#ff4b4b] tracking-normal animate-pulse">
                {text}
            </p>
        </div>
    );
}
