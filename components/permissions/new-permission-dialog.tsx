import { Plus } from "lucide-react";
import React from "react";
import CrearPermiso from "../crear-permiso";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type NewPermissionDialogProps = {
  isPermissionDialogOpen: boolean;
  setIsPermissionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NewPermissionDialog: React.FC<NewPermissionDialogProps> = ({
  isPermissionDialogOpen,
  setIsPermissionDialogOpen,
}) => {
  return (
    <Dialog
      open={isPermissionDialogOpen}
      onOpenChange={setIsPermissionDialogOpen}
    >
      <DialogTrigger asChild>
        <Button onClick={() => {}}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Permiso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <CrearPermiso />
      </DialogContent>
    </Dialog>
  );
};
