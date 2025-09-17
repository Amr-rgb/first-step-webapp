"use client";

import React, { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, UploadCloud } from "lucide-react";

export interface ImagesUploaderProps {
  value: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  accept?: string;
  disabled?: boolean;
  maxSizeMB?: number;
}

export function ImagesUploader({
  value,
  onChange,
  accept = "image/*",
  disabled,
  maxSizeMB = 5,
}: ImagesUploaderProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const previews = useMemo(() => {
    return value.map((item) => {
      if (typeof item === "string") return item;
      return URL.createObjectURL(item);
    });
  }, [value]);

  const revokePreviews = () => {
    value.forEach((item) => {
      if (item instanceof File) URL.revokeObjectURL(URL.createObjectURL(item));
    });
  };

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files || []);
    const filtered = arr.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    if (!filtered.length) return;
    onChange([...(value || []), ...filtered]);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-3">
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
          multiple
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>

      {value?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {previews.map((src, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-muted rounded-md overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`image-${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                onClick={() => removeAt(index)}
                variant="destructive"
                size="icon"
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
