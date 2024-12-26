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
  category: string;
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
                    <Card className="group relative h-[220px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:scale-[1.03] bg-white/95border border-gray-100/80 cursor-pointer">
                      <div className="absolute top-4 right-4 z-10 transform transition-transform duration-500 group-hover:-translate-y-0.5">
                        <Badge
                          variant="secondary"
                          className="backdrop-blur-md bg-white/90 font-medium text-xs shadow-lg ring-1 ring-gray-100/50"
                        >
                          {(result.similarity * 100).toFixed(1)}% relevante
                        </Badge>
                      </div>

                      <CardHeader className="flex h-full flex-col items-center justify-between p-6 text-center">
                        <div className="relative mt-2">
                          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-2xl opacity-0 transition-all duration-700 group-hover:opacity-80" />
                          <div className="relative transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1">
                            <PdfIcon className="h-14 w-14 text-indigo-600/90 drop-shadow-md transition-colors duration-500 group-hover:text-indigo-500" />
                          </div>
                        </div>

                        <div className="space-y-4 mt-4">
                          <CardTitle className="line-clamp-2 text-sm font-medium text-gray-600 transition-colors duration-300 group-hover:text-gray-900">
                            {result.filename}
                          </CardTitle>

                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-gray-50 to-gray-100/80 text-xs font-medium text-gray-500 transition-all duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 ring-1 ring-gray-200/50"
                          >
                            {result.category || "Sin categoría"}
                          </Badge>
                        </div>
                      </CardHeader>

                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/5 to-indigo-100/10 opacity-0 transition-all duration-500 group-hover:opacity-100" />
                      <div className="absolute inset-0 border border-indigo-200/20 rounded-lg opacity-0 transition-all duration-500 group-hover:opacity-100" />
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
