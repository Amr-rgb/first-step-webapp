import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "peer placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex field-sizing-content min-h-16 w-full min-w-0 rounded-md border !bg-white px-6 py-4 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        "focus-visible:text-info focus-visible:border-info",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-muted/50",
        "read-only:bg-muted/30 read-only:cursor-default",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
