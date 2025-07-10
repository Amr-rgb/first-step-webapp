import { create } from "zustand";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  icon?: string;
  type: "page" | "content" | "action";
}

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  isOpen: boolean;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: "",
  results: [],
  isSearching: false,
  isOpen: false,
  recentSearches: [],
  
  setQuery: (query: string) => set({ query }),
  setResults: (results: SearchResult[]) => set({ results }),
  setIsSearching: (isSearching: boolean) => set({ isSearching }),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  
  addRecentSearch: (query: string) => {
    const { recentSearches } = get();
    if (query.trim() && !recentSearches.includes(query)) {
      const newRecentSearches = [query, ...recentSearches].slice(0, 5); // Keep only 5 recent searches
      set({ recentSearches: newRecentSearches });
    }
  },
  
  clearRecentSearches: () => set({ recentSearches: [] }),
  
  clearSearch: () => set({ 
    query: "", 
    results: [], 
    isSearching: false,
    isOpen: false 
  }),
}));
