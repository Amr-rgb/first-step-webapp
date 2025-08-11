"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Clock, Palette, Eye, X } from 'lucide-react';

interface ComingSoonOverlayProps {
  /** Custom message to display instead of default */
  message?: string;
  /** Icon to display alongside the message */
  icon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Show blur effect on background */
  showBlur?: boolean;
  /** Disable pointer events on overlay (allows interaction) */
  allowInteraction?: boolean;
  /** Custom styling theme */
  theme?: 'default' | 'gradient' | 'minimal';
}

const ComingSoonOverlay = ({
  message = "This amazing feature is coming soon! 🚀",
  icon,
  className,
  showBlur = true,
  allowInteraction = false,
  theme = 'gradient'
}: ComingSoonOverlayProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const overlayStyles = {
    default: "bg-white/20 backdrop-blur-[1px]",
    gradient: "bg-gradient-to-br from-purple-50/15 via-blue-50/15 to-indigo-50/15 backdrop-blur-[1px]",
    minimal: "bg-gray-50/20 backdrop-blur-[1px]"
  };

  const contentStyles = {
    default: "bg-white/95 shadow-lg border-2 border-blue-100",
    gradient: "bg-gradient-to-r from-purple-500/95 to-indigo-600/95 text-white shadow-2xl border border-white/20",
    minimal: "bg-white/95 shadow-md border border-gray-200"
  };

  const DefaultIcon = () => {
    switch (theme) {
      case 'gradient':
        return <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />;
      case 'minimal':
        return <Clock className="w-8 h-8 text-gray-500" />;
      default:
        return <Palette className="w-8 h-8 text-blue-500 animate-bounce" />;
    }
  };

  // If in preview mode, only show a small toggle button
  if (isPreviewMode) {
    return (
      <button
        onClick={() => setIsPreviewMode(false)}
        className="absolute top-4 right-4 z-50 p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform group"
        title="Show Coming Soon overlay"
      >
        <Eye className="w-5 h-5" />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Coming Soon
        </span>
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center",
        overlayStyles[theme],
        !allowInteraction && "pointer-events-auto",
        className
      )}
    >
      <div 
        className={cn(
          "relative max-w-md mx-4 p-8 rounded-2xl text-center transform transition-all duration-300 hover:scale-105",
          contentStyles[theme]
        )}
      >
        {/* Background decoration */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
        
        {/* Close/Preview button */}
        <button
          onClick={() => setIsPreviewMode(true)}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full transition-all hover:scale-110",
            theme === 'gradient' ? "bg-white/20 text-white hover:bg-white/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          title="Preview design"
        >
          <Eye className="w-4 h-4" />
        </button>
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {icon || <DefaultIcon />}
        </div>

        {/* Message */}
        <h3 className={cn(
          "text-xl font-semibold mb-2",
          theme === 'gradient' ? "text-white" : "text-gray-800"
        )}>
          Coming Soon!
        </h3>
        
        <p className={cn(
          "text-sm leading-relaxed",
          theme === 'gradient' ? "text-purple-100" : "text-gray-600"
        )}>
          {message}
        </p>

        {/* Animated dots */}
        <div className="flex justify-center mt-6 space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full animate-bounce",
                theme === 'gradient' ? "bg-white/70" : "bg-blue-400"
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Sparkle effects for gradient theme */}
        {theme === 'gradient' && (
          <>
            <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute bottom-8 right-6 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-8 right-8 w-0.5 h-0.5 bg-blue-200 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>

    </div>
  );
};

export default ComingSoonOverlay;
