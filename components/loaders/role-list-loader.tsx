import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const RoleListLoader = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre del Rol</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Permisos</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </TableCell>
            <TableCell className="text-right">
              <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
