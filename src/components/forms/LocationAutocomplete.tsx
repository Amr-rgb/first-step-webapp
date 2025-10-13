"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface LocationSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Google Maps Places API integration
const useGoogleMapsPlaces = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === "your_google_maps_api_key_here") {
      console.warn(
        "Google Maps API key not provided. Location autocomplete will use fallback suggestions."
      );
      setHasApiKey(false);
      return;
    }

    setHasApiKey(true);

    // Load Google Maps API if not already loaded
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        setAutocompleteService(new google.maps.places.AutocompleteService());

        // Create a dummy div for PlacesService (it needs a map or div)
        const dummyDiv = document.createElement("div");
        setPlacesService(new google.maps.places.PlacesService(dummyDiv));
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        setHasApiKey(false);
      };
      document.head.appendChild(script);
    } else if (window.google) {
      setIsLoaded(true);
      setAutocompleteService(new google.maps.places.AutocompleteService());
      const dummyDiv = document.createElement("div");
      setPlacesService(new google.maps.places.PlacesService(dummyDiv));
    }
  }, []);

  return { isLoaded, autocompleteService, placesService, hasApiKey };
};

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const t = useTranslations("auth.center-signup.1.form");
  const locale = useLocale();
  const defaultPlaceholder = placeholder || t("location.placeholder");

  const { isLoaded, autocompleteService, hasApiKey } = useGoogleMapsPlaces();

  // Fallback suggestions when Google Maps API is not available
  const FALLBACK_SUGGESTIONS: LocationSuggestion[] = [
    {
      place_id: "riyadh",
      description: "Riyadh, Saudi Arabia",
      main_text: "Riyadh",
      secondary_text: "Saudi Arabia",
    },
    {
      place_id: "jeddah",
      description: "Jeddah, Saudi Arabia",
      main_text: "Jeddah",
      secondary_text: "Saudi Arabia",
    },
    {
      place_id: "dammam",
      description: "Dammam, Saudi Arabia",
      main_text: "Dammam",
      secondary_text: "Saudi Arabia",
    },
    {
      place_id: "mecca",
      description: "Mecca, Saudi Arabia",
      main_text: "Mecca",
      secondary_text: "Saudi Arabia",
    },
    {
      place_id: "medina",
      description: "Medina, Saudi Arabia",
      main_text: "Medina",
      secondary_text: "Saudi Arabia",
    },
    {
      place_id: "taif",
      description: "Taif, Saudi Arabia",
      main_text: "Taif",
      secondary_text: "Saudi Arabia",
    },
    {
      place_id: "buraidah",
      description: "Buraidah, Saudi Arabia",
      main_text: "Buraidah",
      secondary_text: "Saudi Arabia",
    },
    {
      place_id: "tabuk",
      description: "Tabuk, Saudi Arabia",
      main_text: "Tabuk",
      secondary_text: "Saudi Arabia",
    },
  ];

  // Debounced search function
  const searchPlaces = (query: string) => {
    if (!query.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    setIsLoading(true);

    // Use Google Maps API if available
    if (hasApiKey && isLoaded && autocompleteService) {
      const request: google.maps.places.AutocompleteRequest = {
        input: query,
        types: ["establishment", "geocode"],
        language: locale === "ar" ? "ar" : "en",
        region: "SA", // Saudi Arabia
      };

      autocompleteService.getPlacePredictions(
        request,
        (predictions, status) => {
          setIsLoading(false);

          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const suggestions: LocationSuggestion[] = predictions.map(
              (prediction) => ({
                place_id: prediction.place_id,
                description: prediction.description,
                main_text:
                  prediction.structured_formatting?.main_text ||
                  prediction.description,
                secondary_text:
                  prediction.structured_formatting?.secondary_text || "",
              })
            );

            setFilteredSuggestions(suggestions.slice(0, 8)); // Limit to 8 suggestions
          } else {
            // Fallback to local suggestions
            const fallbackSuggestions = FALLBACK_SUGGESTIONS.filter(
              (suggestion) =>
                suggestion.description
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                suggestion.main_text.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSuggestions(fallbackSuggestions.slice(0, 8));
          }
        }
      );
    } else {
      // Use fallback suggestions when Google Maps API is not available
      setTimeout(() => {
        setIsLoading(false);
        const fallbackSuggestions = FALLBACK_SUGGESTIONS.filter(
          (suggestion) =>
            suggestion.description
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            suggestion.main_text.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSuggestions(fallbackSuggestions.slice(0, 8));
      }, 100); // Small delay to show loading state
    }
  };

  // Filter suggestions based on input value with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value && value.length > 1) {
      debounceRef.current = setTimeout(() => {
        searchPlaces(value);
      }, 300); // 300ms debounce
    } else {
      setFilteredSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, isLoaded, autocompleteService, locale, hasApiKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.description);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSuggestions.length === 0) {
      // Allow normal typing when no suggestions are shown
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        // Allow all other keys (letters, numbers, etc.) to work normally
        break;
    }
  };

  const handleBlur = () => {
    // Delay closing to allow for clicks on suggestions
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  const handleFocus = () => {
    // Always show suggestions when focused if there are any
    if (value && filteredSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={defaultPlaceholder}
        disabled={disabled}
        className={className}
        autoComplete="off"
      />

      {isOpen && (filteredSuggestions.length > 0 || isLoading) && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <li className="px-3 py-2 text-sm text-gray-500">
              {locale === "ar" ? "جاري البحث..." : "Searching..."}
            </li>
          ) : (
            filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.place_id}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === highlightedIndex
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="font-medium">{suggestion.main_text}</div>
                {suggestion.secondary_text && (
                  <div className="text-xs text-gray-500">
                    {suggestion.secondary_text}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
