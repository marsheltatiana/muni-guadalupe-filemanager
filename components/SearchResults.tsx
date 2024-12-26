import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Download, Share, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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
  summary_ESP: string;
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
                    <Card className="group relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50/90 hover:shadow-lg hover:scale-[1.02] h-[140px]">
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-white shadow-sm backdrop-blur-sm font-semibold text-xs"
                        >
                          {(result.similarity * 100).toFixed(1)}%
                        </Badge>
                      </div>

                      <CardHeader className="flex flex-col items-center space-y-3 p-0 w-full">
                        <div className="relative group-hover:animate-pulse">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur opacity-30 group-hover:opacity-40 transition-opacity" />
                          <PdfIcon className="relative w-10 h-10 text-red-500" />
                        </div>

                        <CardTitle className="text-sm font-medium text-gray-700 text-center line-clamp-2 w-full transition-colors duration-200 group-hover:text-gray-900">
                          {result.filename}
                        </CardTitle>
                      </CardHeader>

                      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{result.filename}</DialogTitle>
                      <DialogDescription>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            asChild
                            className="w-fit justify-between"
                          >
                            <Link
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span>Ver</span>
                              <SquareArrowOutUpRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(result.url);

                              toast({
                                title: "Enlace copiado al portapapeles 📋",
                                description:
                                  "Puedes compartir este documento pegando el enlace donde desees",
                              });
                            }}
                            aria-label="Copiar enlace"
                            title="Copiar enlace"
                          >
                            <Share />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={async () => {
                              try {
                                const response = await fetch(result.url);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = result.filename;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);

                                toast({
                                  title: "Descargando documento 📥",
                                  description:
                                    "El documento comenzará a descargarse en breve",
                                });
                              } catch (error) {
                                toast({
                                  title: "Error al descargar",
                                  description:
                                    "No se pudo descargar el documento",
                                  variant: "destructive",
                                });
                              }
                            }}
                            aria-label="Descargar documento"
                            title="Descargar documento"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <span className="font-semibold">Resumen</span>
                    <div className="max-h-[200px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300">
                      <p
                      className="text-gray-700 leading-relaxed text-base tracking-normal
                      prose prose-sm max-w-none
                      prose-p:my-0.5 prose-p:leading-normal
                      font-normal break-words break-all whitespace-pre-wrap pr-2"
                      >
                      <Markdown>
                      {result.summary_ESP ||
                      "No se encontró un resumen para este documento"}
                      </Markdown>
                      </p>
                    </div>
                    <span className="font-semibold">
                      Vista previa del contenido
                    </span>
                    <div className="relative mt-4 bg-gray-50 rounded-lg p-4">
                      <div className="max-h-[200px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300">
                        <p
                          className="text-gray-700 leading-relaxed text-base tracking-normal
                        prose prose-sm max-w-none
                        font-normal break-words break-all whitespace-pre-wrap pr-2"
                        >
                          {result.fragment}
                        </p>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 w-full h-16 
                        bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent
                        rounded-b-lg pointer-events-none"
                      />
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
