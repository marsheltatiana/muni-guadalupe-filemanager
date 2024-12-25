"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Search } from "lucide-react";
import { useState } from "react";
import { SearchResults } from "./SearchResults";

interface SearchResult {
  filename: string;
  url: string;
  fragment: string;
  similarity: number;
}

interface SearchResponse {
  query: string;
  results: {
    count: number;
    top_k: number;
    items: SearchResult[];
  };
  metadata: {
    search_duration: number;
    search_duration_unit: string;
    timestamp: string;
    total_documents: number;
  };
}

export function DocumentSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalDocuments, setTotalDocuments] = useState<number | null>(null);
  const [searchDuration, setSearchDuration] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data: SearchResponse = await response.json();
      setSearchResults(data.results.items);
      setTotalDocuments(data.metadata.total_documents);
      setSearchDuration(data.metadata.search_duration);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching documents:", error);
      toast({
        title: "Error",
        description:
          "No se pudo realizar la búsqueda. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <motion.div
        className={`flex items-center justify-center transition-all duration-500 ease-in-out ${
          hasSearched ? "w-3/5 border-r border-gray-200" : "w-full"
        }`}
        initial={false}
        animate={{
          width: hasSearched ? "60%" : "100%",
        }}
      >
        <div className="w-full lg:max-w-[70%] p-6">
          <motion.div layout className="flex flex-col items-center">
            <motion.h1 
              className="text-5xl font-light text-center text-gray-800 font-playfair tracking-wide overflow-hidden"
              animate={{
              fontSize: hasSearched ? "2rem" : "3rem",
              opacity: 1,
              marginBottom: hasSearched ? 16 : 32,
              }}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              ¿En qué puedo ayudarte hoy?
            </motion.h1>
            <motion.p
              className="text-2xl text-center mb-8 text-gray-600 font-light tracking-wide overflow-hidden"
              animate={{
                fontSize: hasSearched ? "1rem" : "1.2rem",
                opacity: 1,
                marginBottom: hasSearched ? 0 : 32,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Búsqueda de Documentos del Archivo General
            </motion.p>
            <div className="w-full">
              <div className="flex gap-2 items-start rounded-xl shadow-lg p-2">
                <div className="flex-grow relative">
                  <textarea
                    placeholder="Resolución Municipal 2024..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    className="w-full min-h-[48px] max-h-[200px] p-3 text-lg rounded-lg resize-none overflow-hidden bg-transparent"
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                    rows={1}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                  >
                    {isSearching ? (
                      <motion.div
                        className="h-5 w-5 rounded-full border-t-2 border-r-2 border-white"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <Search className="h-5 w-5 text-white" />
                    )}
                  </Button>
                  <Button
                    className="rounded-full w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-all duration-300 transform hover:scale-105"
                    onClick={() =>
                      toast({
                        title: "Función no implementada",
                        description:
                          "La entrada de voz se implementará en el futuro.",
                      })
                    }
                  >
                    <Mic className="h-5 w-5 text-slate-600" />
                  </Button>
                </div>
              </div>
              {totalDocuments !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-indigo-600">
                      {totalDocuments.toLocaleString()}
                    </span>{" "}
                    documentos analizados en{" "}
                    <span className="font-medium text-indigo-600">
                      {searchDuration.toFixed(2)}
                    </span>{" "}
                    segundos
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "40%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white"
          >
            {searchResults.length > 0 ? (
              <SearchResults results={searchResults} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-lg">
                  No se encontraron resultados
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
