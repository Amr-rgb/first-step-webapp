"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FileLinkViewerProps {
  fileUrl?: string;
  file?: File;
  label: string;
  className?: string;
  showImagePreview?: boolean;
}

export default function FileLinkViewer({ 
  fileUrl, 
  file, 
  label, 
  className = "",
  showImagePreview = false 
}: FileLinkViewerProps) {
  const [url, setUrl] = useState<string>('');
  const [isImage, setIsImage] = useState(false);
  const displayName = file?.name || label;
  
  useEffect(() => {
    let objectUrl = '';
    
    if (file) {
      objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      setIsImage(file.type.startsWith('image/'));
    } else if (fileUrl) {
      setUrl(fileUrl);
      // Check if URL points to an image by extension
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      setIsImage(imageExtensions.some(ext => fileUrl.toLowerCase().endsWith(ext)));
    }
    
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file, fileUrl]);
  
  if (!url) return null;

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = url;
    link.download = displayName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between border rounded-md px-4 py-2">
        <span className="text-sm font-medium truncate max-w-[180px]">{displayName}</span>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download {displayName}</span>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Open in new tab"
          >
            <Link href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Open {displayName} in new tab</span>
            </Link>
          </Button>
        </div>
      </div>
      {showImagePreview && isImage && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <img 
            src={url} 
            alt={displayName} 
            className="max-h-40 w-auto mx-auto"
            onError={(e) => {
              // Hide the image if it fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
