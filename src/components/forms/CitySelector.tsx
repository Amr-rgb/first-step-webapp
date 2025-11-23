"use client";

import { useState } from "react";
import { Check, ChevronDown, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCities } from "@/hooks/useCities";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface CitySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function CitySelector({
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
}: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const { cities, isLoading, error, refetch } = useCities();
  const t = useTranslations("auth.center-signup.1.form");
  const locale = useLocale();

  const selectedCity = cities.find((city) => city.id.toString() == value);
  const defaultPlaceholder = placeholder || t("city.placeholder");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "peer file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 items-center justify-between rounded-md border !bg-white px-6 py-6 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:text-info focus-visible:border-info",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedCity
            ? selectedCity.name[locale === "ar" ? "ar" : "en"]
            : defaultPlaceholder}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput
            placeholder={
              locale === "ar" ? "البحث عن مدينة..." : "Search city..."
            }
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="py-6 text-center text-sm">
                  {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                </div>
              ) : error ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-destructive mb-3">
                    {locale === "ar"
                      ? "حدث خطأ في تحميل المدن"
                      : "Error loading cities"}
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetch()}
                    className="mx-auto"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center text-sm">
                  {locale === "ar"
                    ? "لم يتم العثور على نتائج."
                    : "No results found."}
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name[locale === "ar" ? "ar" : "en"]}
                  onSelect={() => {
                    onChange?.(city.id.toString());
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.name[locale === "ar" ? "ar" : "en"]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
