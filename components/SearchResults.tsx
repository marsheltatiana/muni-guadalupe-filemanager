import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { PdfIcon } from "./ui/icons";

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
  const sortedResults = [...results].sort(
    (a, b) => b.similarity - a.similarity
  );

  return (
    <div className="h-full flex">
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Resultados</h2>
            <p className="text-sm text-gray-500 mt-1">
              Se encontraron {results.length} documentos
            </p>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="grid grid-cols-3 gap-4">
            {sortedResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 hover:shadow-sm">
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-blue-600">
                          {(result.similarity * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <CardHeader className="flex flex-col items-center">
                        <PdfIcon />
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
                        <Link
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline flex items-center gap-3"
                        >
                          <span>Ver documento</span>
                          <SquareArrowOutUpRight width={16} height={16} />
                        </Link>
                      </DialogDescription>
                    </DialogHeader>
                    <span className="font-semibold">Ubicación física</span>
                    <span className="font-semibold">
                      Vista previa del contenido
                    </span>
                    <div className="relative">
                      <p className="text-gray-800 text-justify pb-4 text-wrap max-w-md break-all overflow-wrap-anywhere whitespace-pre-line">
                        {result.fragment}
                      </p>
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
