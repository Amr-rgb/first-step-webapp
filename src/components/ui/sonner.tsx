"use client";

// import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = "light";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      visibleToasts={5}
      closeButton={true}
      gap={8}
      toastOptions={{
        className: "sonner-toast",
      }}
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "#111827",
          "--normal-border": "#e5e7eb",
          "--success-bg": "white",
          "--success-text": "#111827",
          "--success-border": "#10b981",
          "--error-bg": "white",
          "--error-text": "#111827",
          "--error-border": "#ef4444",
          "--warning-bg": "white",
          "--warning-text": "#111827",
          "--warning-border": "#f59e0b",
          "--info-bg": "white",
          "--info-text": "#111827",
          "--info-border": "#3b82f6",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
