"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { SearchResult } from "@/store/searchStore";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  recentSearches: string[];
  isSearching: boolean;
  onClose: () => void;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isOpen,
  query,
  results,
  recentSearches,
  isSearching,
  onClose,
  onSearchChange,
  onSearchSubmit,
}) => {
  const t = useTranslations("dashboard.search");

  const handleResultClick = () => {
    onSearchSubmit();
    onClose();
  };

  const handleRecentClick = (searchQuery: string) => {
    onSearchChange(searchQuery);
  };

  const getResultIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      home: () => <div className="w-4 h-4 bg-blue-500 rounded" />,
      users: () => <div className="w-4 h-4 bg-green-500 rounded" />,
      calendar: () => <div className="w-4 h-4 bg-purple-500 rounded" />,
      "file-text": () => <div className="w-4 h-4 bg-orange-500 rounded" />,
      bell: () => <div className="w-4 h-4 bg-red-500 rounded" />,
      building: () => <div className="w-4 h-4 bg-indigo-500 rounded" />,
      megaphone: () => <div className="w-4 h-4 bg-pink-500 rounded" />,
      edit: () => <div className="w-4 h-4 bg-teal-500 rounded" />,
      files: () => <div className="w-4 h-4 bg-yellow-500 rounded" />,
      user: () => <div className="w-4 h-4 bg-gray-500 rounded" />,
      "log-out": () => <div className="w-4 h-4 bg-red-600 rounded" />,
    };

    const IconComponent = iconMap[iconName] || iconMap.home;
    return <IconComponent />;
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Results Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-full max-w-2xl"
          >
            {/* Search State */}
            {isSearching && (
              <div className="py-8 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 px-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Query - Show Recent Searches */}
            {!query.trim() && !isSearching && recentSearches.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {t("recentSearches")}
                </h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <span>{search}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Query - Empty State */}
            {!query.trim() && !isSearching && recentSearches.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">{t("startTyping")}</p>
              </div>
            )}

            {/* Has Query but No Results */}
            {query.trim() && !isSearching && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  {t("noResults", { query })}
                </p>
              </div>
            )}

            {/* Results */}
            {query.trim() && !isSearching && results.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {Object.entries(groupedResults).map(
                  ([category, categoryResults]) => (
                    <div key={category} className="p-2">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-3">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {categoryResults.map((result) => (
                          <Link
                            key={result.id}
                            href={result.url}
                            onClick={handleResultClick}
                            className={cn(
                              "block px-3 py-3 rounded-lg transition-colors hover:bg-gray-50 group",
                              "border border-transparent hover:border-gray-100"
                            )}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getResultIcon(result.icon || "home")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-primary">
                                  {result.title}
                                </p>
                                {result.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {result.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Footer */}
            {query.trim() && results.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  {t("resultsCount", { count: results.length })}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchResults;
