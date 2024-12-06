"use client";

import CrearPermiso from "@/components/crear-permiso";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Permisos, Rol } from "@prisma/client";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permisos[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState<Rol | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchRoles(): Promise<void> {
      const roles: Rol[] = await fetch("/api/roles").then((res) => res.json());

      setRoles(roles);
    }

    async function fetchPermissions(): Promise<void> {
      const permissions: Permisos[] = await fetch("/api/permisos").then((res) =>
        res.json()
      );

      setPermisos(permissions);
    }

    Promise.all([fetchRoles(), fetchPermissions()]);

    return () => {};
  }, []);

  const filteredRoles = roles.filter(
    (role) =>
      role.nombre_rol!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-6 w-fit">
      <h1 className="text-3xl font-bold mb-6">Gestión de roles y permisos</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2"
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
              <Button onClick={() => setEditingRole(null)}>
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
                  {/* {role.permissions
                    .map(
                      (permId) =>
                        permissions.find((p) => p.id === permId)?.description
                    )
                    .join(", ")} */}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingRole(role);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {}}>
                    <Trash2 className="h-4 w-4" />
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
