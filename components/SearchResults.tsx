import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { File, Grid, List } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface SearchResult {
  filename: string;
  url: string;
  fragment: string;
  similarity: number;
}

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const [selectedDocument, setSelectedDocument] = useState<SearchResult | null>(
    null
  );
  const [view, setView] = useState<"list" | "grid">("list");

  const sortedResults = [...results].sort(
    (a, b) => b.similarity - a.similarity
  );

  return (
    <div className="h-full flex">
      <div className="w-full border-r border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Resultados</h2>
            <p className="text-sm text-gray-500 mt-1">
              Se encontraron {results.length} documentos
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setView("list")}>
              <List />
            </Button>
            <Button onClick={() => setView("grid")}>
              <Grid />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div
            className={
              view === "list" ? "space-y-4 pr-4" : "grid grid-cols-3 gap-4"
            }
          >
            {sortedResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {view === "list" ? (
                  <Card
                    className={`border rounded-lg cursor-pointer transition-colors ${
                      selectedDocument?.url === result.url
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedDocument(result)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-800 font-semibold">
                        {result.filename}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="ml-2 text-blue-600">
                          {(result.similarity * 100).toFixed(1)}%
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {result.fragment}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 hover:shadow-sm">
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="text-blue-600">
                            {(result.similarity * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <CardHeader className="flex flex-col items-center">
                          <File className="w-12 h-12 text-red-500 mb-2" />
                          <CardTitle className="text-sm font-semibold text-gray-800">
                            {result.filename}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{result.filename}</DialogTitle>
                        <DialogDescription>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {result.url}
                          </a>
                        </DialogDescription>
                      </DialogHeader>
                      <p className="text-gray-800 mt-4">{result.fragment}</p>
                    </DialogContent>
                  </Dialog>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
