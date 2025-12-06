
import React from "react";

interface LoadingSpinnerProps {
    text?: string;
}

export default function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ff4b4b]"></div>
            <p className="mt-6 text-lg font-bold text-[#ff4b4b] animate-pulse">{text}</p>
        </div>
    );
}
