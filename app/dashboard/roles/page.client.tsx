"use client";

import CrearPermiso from "@/components/crear-permiso";
import { RoleListLoader } from "@/components/loaders/role-list-loader";
import { RolesTable } from "@/components/roles/roles-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Permisos, Rol, Rol_Permisos } from "@prisma/client";
import { Plus, Search } from "lucide-react";
import React, { Suspense, useState } from "react";

interface Rol_PermisosWithPermiso extends Rol_Permisos {
  Permisos: Permisos;
}

interface RolWithPermissions extends Rol {
  Rol_Permisos: Rol_PermisosWithPermiso[];
}

type RolesClientPageProps = {
  roles: RolWithPermissions[];
  permisos: Permisos[];
};

const RolesClientPage: React.FC<RolesClientPageProps> = ({
  roles,
  permisos,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const filteredRoles = roles.filter(
    (role) =>
      role.nombre_rol!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-6 w-fit">
      <h1 className="text-3xl font-bold mb-6">Gestión de roles y permisos</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 mb-6">
        <div className="relative w-full md:w-fit top-2 mr-3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
        <section className="flex items-center gap-4">
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {}}>
                <Plus className="mr-2 h-4 w-4" /> Añadir Rol
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Rol</DialogTitle>
                <DialogDescription>
                  Crea un nuevo rol y asigna permisos
                </DialogDescription>
              </DialogHeader>
              <RoleForm permisos={permisos} />
            </DialogContent>
          </Dialog>
        </section>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Suspense fallback={<RoleListLoader />}>
          <RolesTable
            roles={roles}
            filteredRoles={filteredRoles}
            setIsDialogOpen={setIsDialogOpen}
          />
        </Suspense>
      </div>
    </div>
  );
};

type RoleFormProps = {
  permisos: Permisos[];
};

function RoleForm({ permisos }: RoleFormProps) {
  const [formData, setFormData] = useState<Rol>({
    id_rol: 0,
    nombre_rol: "",
    descripcion: "",
  });

  const [persmisosSeleccionados, setPersmisosSeleccionados] = useState<
    number[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/roles", {
      method: "POST",
      body: JSON.stringify({
        rol: formData,
        permisos: persmisosSeleccionados,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast({
        title: "Rol Creado",
        description: "El rol se ha creado correctamente.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el rol.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nombre
          </Label>
          <Input
            id="nombre_rol"
            type="text"
            value={formData.nombre_rol || ""}
            onChange={(e) =>
              setFormData({ ...formData, nombre_rol: e.target.value })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descripción
          </Label>
          <Input
            id="descripcion"
            type="text"
            value={formData.descripcion || ""}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right">Permisos</Label>
          <ScrollArea className="h-[200px] col-span-3">
            {permisos.map((permiso) => (
              <div
                key={permiso.id_permiso}
                className="flex items-center space-x-2 mb-2"
              >
                <Checkbox
                  id={permiso.id_permiso.toString()}
                  onCheckedChange={(state) => {
                    if (!state) {
                      setPersmisosSeleccionados(
                        persmisosSeleccionados.filter(
                          (id) => id !== permiso.id_permiso
                        )
                      );
                      return;
                    }
                    setPersmisosSeleccionados([
                      ...persmisosSeleccionados,
                      permiso.id_permiso,
                    ]);
                  }}
                />
                <label
                  htmlFor={`permission-${permiso.id_permiso}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {permiso.nombre_permiso?.replace(/_/g, " ").toUpperCase()}
                </label>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
}

export default RolesClientPage;
