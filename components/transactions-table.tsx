"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Documento, Transaccion, Usuario } from "@prisma/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface TransaccioUser extends Transaccion {
  Usuario: Usuario;
  Documento: Documento;
}

const columns: ColumnDef<TransaccioUser>[] = [
  {
    accessorKey: "id_transaccion",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
        </Button>
      );
    },
  },
  {
    accessorKey: "Usuario",
    cell: ({ row }) => {
      return row.original.Usuario.nombre;
    },
  },
  {
    accessorKey: "Documento",
    cell: ({ row }) => {
      return row.original.Documento?.nombre || "No Disponible o Eliminado";
    },
  },
  {
    accessorKey: "tipo_transaccion",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
        </Button>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value === null || row.getValue(id) === value;
    },
  },
  {
    accessorKey: "fecha_inicio",
    header: "Fecha Inicio",
    cell: ({ row }) => {
      return new Date(row.getValue("fecha_inicio")).toLocaleDateString(
        "es-ES",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );
    },
  },
  {
    accessorKey: "fecha_fin",
    header: "Fecha Fin",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_fin");
      return fecha && typeof fecha === "string"
        ? new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "N/A";
    },
  },
];

type TablaTransaccionesProps = {
  className?: string;
  transacciones: TransaccioUser[];
};

export function TransactionsTable({
  className,
  transacciones,
}: TablaTransaccionesProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filteredData = typeFilter
    ? transacciones.filter((t) => t.tipo_transaccion === typeFilter)
    : transacciones;

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className={cn("w-full border-0 shadow-none", className)}>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar transacciones..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Historial de transacciones de documentos</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
