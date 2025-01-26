import { Permisos, Rol, Rol_Permisos } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { EditRolForm } from "./edit-rol-form";

interface Rol_PermisosWithPermiso extends Rol_Permisos {
  Permisos: Permisos;
}

interface RolWithPermissions extends Rol {
  Rol_Permisos: Rol_PermisosWithPermiso[];
}

type EditRolDialogProps = {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rolSelected: RolWithPermissions | null;
  permissions: Permisos[];
};

export const EditRolDialog = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  rolSelected,
  permissions,
}: EditRolDialogProps) => {
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Rol {rolSelected?.nombre_rol}</DialogTitle>
          <DialogDescription>Edita el rol y asigna permisos</DialogDescription>
        </DialogHeader>
        {rolSelected && permissions && (
          <EditRolForm rol={rolSelected} permissions={permissions} />
        )}
      </DialogContent>
    </Dialog>
  );
};
