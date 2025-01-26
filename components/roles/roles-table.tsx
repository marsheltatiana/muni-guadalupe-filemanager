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

import { toast } from "@/hooks/use-toast";
import { Permisos, Rol, Rol_Permisos } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleDelete = async (role: RolWithPermissions) => {
    await fetch(`/api/roles?id=${role.id_rol}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          toast({
            title: "Rol eliminado ✅",
            description: `El rol ${role.nombre_rol} ha sido eliminado.`,
          });
        } else {
          toast({
            title: "Error al eliminar el rol ❌",
            description: `El rol ${role.nombre_rol} no pudo ser eliminado.`,
            variant: "destructive",
          });
        }
      })
      .catch((e: Error) => {
        toast({
          title: "Error al eliminar el rol ❌",
          description: `Causa: ${e.message}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        router.refresh();
      });
  };

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
        {filteredRoles.map((role, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{role.nombre_rol}</TableCell>
            <TableCell>{role.descripcion}</TableCell>
            <TableCell>
              {role.Rol_Permisos.map((rp, index) => (
                <Badge key={index} variant="outline" className="m-1">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  handleDelete(role);
                }}
              >
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
