import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Permisos, Rol, Rol_Permisos } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface Rol_PermisosWithPermiso extends Rol_Permisos {
  Permisos: Permisos;
}

interface RolWithPermissions extends Rol {
  Rol_Permisos: Rol_PermisosWithPermiso[];
}

type RolesTableProps = {
  roles: RolWithPermissions[];
  filteredRoles: RolWithPermissions[];
  setRolSelected: React.Dispatch<
    React.SetStateAction<RolWithPermissions | null>
  >;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  filteredRoles,
  setRolSelected,
  setIsEditDialogOpen,
}) => {
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
        {filteredRoles.map((role) => (
          <TableRow key={role.id_rol}>
            <TableCell className="font-medium">{role.nombre_rol}</TableCell>
            <TableCell>{role.descripcion}</TableCell>
            <TableCell>
              {role.Rol_Permisos.map((rp) => (
                <Badge key={rp.permiso_id} variant="outline" className="m-1">
                  {rp.Permisos.nombre_permiso
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
              ))}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setRolSelected(role);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {}} disabled>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{roles.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
