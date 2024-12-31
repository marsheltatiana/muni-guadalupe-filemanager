"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Search } from "lucide-react";
import { useState } from "react";
import { NeonBorderOverlay } from "./neon-border-overlay";
import { SearchResults } from "./SearchResults";
import { Textarea } from "./ui/textarea";

interface SearchResult {
  filename: string;
  url: string;
  category: string;
  fragment: string;
  similarity: number;
  summary_ESP: string;
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
        cache: "no-cache",
      });

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data: SearchResponse = await response.json();
      setSearchResults(data.results.items);
      setTotalDocuments(data.metadata.total_documents);
      setSearchDuration(data.metadata.search_duration);
      setHasSearched(true);

      await fetch("/api/estadisticas/search", {
        method: "POST",
        body: JSON.stringify({
          consulta: data.query,
          tiempo_segundos: data.metadata.search_duration,
        }),
      })
        .then((response) => {})
        .catch(console.error);
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
              layout
              animate={{
                scale: hasSearched ? 0.8 : 1,
                opacity: 1,
                y: 0,
              }}
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                layout: { duration: 0.4 },
              }}
            >
              ¿En qué puedo ayudarte hoy?
            </motion.h1>
            <motion.p
              className="text-2xl text-center mb-8 text-gray-600 font-light tracking-wide overflow-hidden"
              layout
              animate={{
                scale: hasSearched ? 0.65 : 1,
                opacity: 1,
                y: 0,
              }}
              initial={{ opacity: 0, y: 15 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                layout: { duration: 0.4 },
                delay: 0.1,
              }}
            >
              Búsqueda de Documentos del Archivo General
            </motion.p>
            <div className="w-full">
              <div className="relative">
                <div className="flex gap-2 items-start rounded-xl shadow-lg p-2">
                  <div className="flex-grow relative">
                    <Textarea
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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative w-5 h-5"
                        >
                          <motion.div
                            className="absolute inset-0 w-4 h-4 m-auto"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              ease: "linear",
                              repeat: Infinity,
                            }}
                          >
                            <div className="w-1 h-1 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
                            <div className="w-1 h-1 bg-white rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2" />
                            <div className="w-1 h-1 bg-white rounded-full absolute left-0 top-1/2 transform -translate-y-1/2" />
                            <div className="w-1 h-1 bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2" />
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Search className="h-5 w-5 text-white" />
                        </motion.div>
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
                <NeonBorderOverlay />
              </div>
              {totalDocuments !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {totalDocuments.toLocaleString()}
                    </span>{" "}
                    documentos analizados en{" "}
                    <span className="font-medium">
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
