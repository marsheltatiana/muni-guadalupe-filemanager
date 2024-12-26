"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Categoria_Documento, Contenedor, Documento } from "@prisma/client";
import { Download, ExternalLink, FileText, Filter, Link } from "lucide-react";
import * as React from "react";

interface DocumentoWithContenedorCategoria extends Documento {
  Contenedor: Contenedor;
  Categoria_Documento: Categoria_Documento;
}

type DocumentsTableProps = {
  documents: DocumentoWithContenedorCategoria[];
};

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
}) => {
  const [search, setSearch] = React.useState("");
  const [yearFilter, setYearFilter] = React.useState<string | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.nombre!.toLowerCase().includes(search.toLowerCase()) ||
      doc.descripcion!.toLowerCase().includes(search.toLowerCase());
    const matchesYear = yearFilter ? doc.anio === yearFilter : true;
    return matchesSearch && matchesYear;
  });

  const uniqueYears = Array.from(new Set(documents.map((doc) => doc.anio)));

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar documentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar por año
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setYearFilter(null)}>
              Todos los años
            </DropdownMenuItem>
            {uniqueYears.map((year) => (
              <DropdownMenuItem key={year} onClick={() => setYearFilter(year)}>
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Contenedor</TableHead>
              <TableHead>Fila & Columna</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id_documento}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {doc.nombre}
                  </div>
                </TableCell>
                <TableCell>{doc.descripcion?.slice(0, 20)}...</TableCell>
                <TableCell>{doc.anio}</TableCell>
                <TableCell>
                  {doc.Categoria_Documento.nombre_categoria}
                </TableCell>
                <TableCell>{doc.Contenedor.nombre}</TableCell>
                <TableCell>
                  {doc.Contenedor.fila} - {doc.Contenedor.columna}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.documento_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
