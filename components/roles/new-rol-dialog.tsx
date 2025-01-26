import { Permisos } from "@prisma/client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { NewRolForm } from "./new-rol-form";

type NewRolDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  permisos: Permisos[];
};

export const NewRolDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  permisos,
}: NewRolDialogProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => {}}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Rol
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Rol</DialogTitle>
          <DialogDescription>
            Crea un nuevo rol y asigna permisos
          </DialogDescription>
        </DialogHeader>
        <NewRolForm permissions={permisos} />
      </DialogContent>
    </Dialog>
  );
};
