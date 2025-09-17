"use client";

import React, { useEffect, useMemo, useState, useId } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, X } from "lucide-react";

interface FileUploaderProps {
  value: File | string | null;
  onChange: (file: File | string | null) => void;
  accept?: string;
  disabled?: boolean;
}

export function FileUploader({
  value,
  onChange,
  accept,
  disabled,
}: FileUploaderProps) {
  const t = useTranslations("auth.center-signup.4.form");
  const inputId = useId();

  const [isDragging, setIsDragging] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Determine preview URL when value is a File
  const previewUrl = useMemo(() => {
    if (typeof value === "string") return value;
    if (value instanceof File) return objectUrl;
    return null;
  }, [value, objectUrl]);

  const fileSizeText = useMemo(() => {
    if (value instanceof File) {
      const bytes = value.size;
      if (bytes < 1024) return `${bytes} B`;
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(1)} KB`;
      const mb = kb / 1024;
      return `${mb.toFixed(1)} MB`;
    }
    return undefined;
  }, [value]);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setObjectUrl(null);
      };
    }
    // Cleanup if switching away from File
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange(file);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div
      className={
        "rounded-lg border border-dashed transition-colors " +
        (isDragging ? "border-primary bg-primary/5" : "border-border")
      }
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <div className="flex items-center gap-3 p-3">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor={inputId} className="block cursor-pointer">
              <div className="text-sm font-medium text-primary underline truncate">
                {typeof value === "string"
                  ? decodeURIComponent(value.split("/").pop() || "file")
                  : value?.name}
              </div>
            </label>
            <div className="text-xs text-muted-foreground truncate">
              {fileSizeText}
            </div>
          </div>
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="h-7 w-7"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
          <input
            id={inputId}
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept={accept}
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full px-3 py-4 text-sm gap-2">
          <PaperclipIcon className="h-4 w-4 text-primary" />
          <label
            htmlFor={inputId}
            className="text-primary underline cursor-pointer"
          >
            {t("file-placeholder")}
          </label>
          <span className="text-muted-foreground">or drag and drop</span>
          <input
            id={inputId}
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept={accept}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
