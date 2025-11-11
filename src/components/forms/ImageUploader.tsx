"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";

interface ImageUploaderProps {
  value: File | string | null;
  onChange: (file: File | string | null) => void;
  accept?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  aspectRatio?: string;
}

export function ImageUploader({
  value,
  onChange,
  accept = "image/*",
  disabled,
  maxSizeMB = 5,
  aspectRatio = "aspect-[16/5]",
}: ImageUploaderProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (typeof value === "string") return value;
    if (value instanceof File) return objectUrl;
    return null;
  }, [value, objectUrl]);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const addFile = (file: File | null) => {
    if (!file) return;
    const withinLimit = file.size <= maxSizeMB * 1024 * 1024;
    if (!withinLimit) return;
    onChange(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFile(e.target.files?.[0] || null);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFile(e.dataTransfer.files?.[0] || null);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const remove = () => onChange(null);

  return (
    <div className="space-y-3">
      {!previewUrl && (
        <div
          className={
            "rounded-lg border border-dashed p-4 text-center bg-muted/20 transition-colors " +
            (isDragging ? "border-primary bg-primary/5" : "border-border")
          }
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <UploadCloud className="h-4 w-4 text-primary" />
            <label
              htmlFor={inputId}
              className="text-primary cursor-pointer underline"
            >
              Click to upload
            </label>
            <span className="text-muted-foreground">or drag and drop</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Max {maxSizeMB}MB
          </div>
          <input
            id={inputId}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={onInputChange}
            disabled={disabled}
          />
        </div>
      )}

      {previewUrl && (
        <div className="relative">
          <div
            className={`${
              aspectRatio || "aspect-[16/5]"
            } w-full rounded-md overflow-hidden bg-muted`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="destructive"
              className="rounded-full h-9 w-9"
              onClick={remove}
              disabled={disabled}
            >
              <X className="h-5 w-5" />
            </Button>
            <input
              id={inputId}
              type="file"
              className="sr-only"
              accept={accept}
              onChange={onInputChange}
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}
