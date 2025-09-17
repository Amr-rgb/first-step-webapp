"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      handleUnselect(item);
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between min-h-10 h-auto", className)}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              selected.map((item) => {
                const option = options.find((opt) => opt.value === item);
                return (
                  <Badge
                    variant="secondary"
                    key={item}
                    className={cn(
                      "mr-1 mb-1 pl-3 pr-1 py-1.5 h-7",
                      "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
                      "border border-blue-200/60 dark:border-blue-800/40",
                      "text-blue-900 dark:text-blue-100",
                      "hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40",
                      "hover:border-blue-300/80 dark:hover:border-blue-700/60",
                      "transition-all duration-200 ease-out",
                      "shadow-sm hover:shadow-md",
                      "group cursor-pointer"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <span className="font-medium text-xs leading-none">
                      {option?.label}
                    </span>
                    <div
                      className={cn(
                        "ml-2 -mr-0.5 h-5 w-5 rounded-full",
                        "flex items-center justify-center",
                        "hover:bg-blue-200/60 dark:hover:bg-blue-800/60",
                        "focus:bg-blue-200/60 dark:focus:bg-blue-800/60",
                        "transition-colors duration-150",
                        "ring-offset-background rounded-full outline-none",
                        "focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-1",
                        "group-hover:bg-blue-200/40 dark:group-hover:bg-blue-800/40"
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                    >
                      <X className="h-3 w-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors" />
                    </div>
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-4 !pointer-events-auto"
        align="start"
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm border transition-all duration-200",
                selected.includes(option.value)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-secondary/50 border-border"
              )}
            >
              {option.label}
              {selected.includes(option.value) && (
                <Check className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full p-0.5" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
