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
import { Documento } from "@prisma/client";
import { Download, FileText, Filter } from "lucide-react";
import * as React from "react";

export function DocumentsTable() {
  const [documents, setDocuments] = React.useState<Documento[]>([]);

  React.useEffect(() => {
    fetch("/api/documentos")
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, []);

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
                <TableCell>{doc.descripcion}</TableCell>
                <TableCell>{doc.anio}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.documento_url, "_blank")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
