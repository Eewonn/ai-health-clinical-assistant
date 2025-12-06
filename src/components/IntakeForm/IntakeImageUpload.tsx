import { useCallback, useRef, useState } from "react";
import { Button } from "@/modules/ui/components/button";
import { cn } from "@/lib/utils";

interface IntakeImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
}

export function IntakeImageUpload({
    value,
    onChange,
    className,
}: IntakeImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(value);

    const handleFile = useCallback(
        (file: File) => {
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setPreview(base64String);
                    onChange(base64String);
                };
                reader.readAsDataURL(file);
            }
        },
        [onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        },
        [handleFile]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        },
        [handleFile]
    );

    const handleRemove = useCallback(() => {
        setPreview(undefined);
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [onChange]);

    return (
        <div className={cn("space-y-4", className)}>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-2xl transition-all cursor-pointer bg-slate-50 hover:bg-slate-100",
                    isDragging ? "border-primary bg-primary/5" : "border-gray-300",
                    preview ? "border-transparent bg-slate-900" : ""
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />

                {preview ? (
                    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden rounded-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="Full body preview"
                            className="max-h-[400px] w-auto object-contain rounded-lg"
                        />
                        <div className="absolute top-4 right-4">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="p-4 rounded-full bg-white shadow-sm">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-medium text-gray-700">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                SVG, PNG, JPG or GIF (max 10MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
