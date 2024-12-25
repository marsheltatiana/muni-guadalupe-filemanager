import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Download, Share, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
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
                    <span className="font-semibold">Ubicación física</span>
                    <span className="font-semibold">
                      Vista previa del contenido
                    </span>
                    <div className="relative mt-4 bg-gray-50 rounded-lg p-4">
                      <p
                        className="text-gray-700 leading-relaxed text-base tracking-normal
                      prose prose-sm max-w-none
                      font-normal break-words
                      line-clamp-6"
                      >
                        {result.fragment}
                      </p>
                      <div
                        className="absolute bottom-0 left-0 w-full h-16 
                      bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent
                      rounded-b-lg"
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
