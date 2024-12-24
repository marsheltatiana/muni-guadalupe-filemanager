import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export const DocumentListLoader = () => {
  return (
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
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Documento {i}
              </div>
            </TableCell>
            <TableCell>Descripción del documento {i}</TableCell>
            <TableCell>2021</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
