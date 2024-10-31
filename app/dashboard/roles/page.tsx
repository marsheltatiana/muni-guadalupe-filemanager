"use client";

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
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";

// Tipos para nuestros datos
type Permission = {
  id: string;
  name: string;
  description: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

// Datos de ejemplo
const initialPermissions: Permission[] = [
  { id: "1", name: "leer_documentos", description: "Leer documentos" },
  { id: "2", name: "guardar_documentos", description: "Escribir documentos" },
  { id: "3", name: "eliminar_documentos", description: "Eliminar documentos" },
  { id: "4", name: "administrar_usuarios", description: "Gestionar usuarios" },
  { id: "5", name: "generar_reportes", description: "Generar reportes" },
];

const initialRoles: Role[] = [
  {
    id: "1",
    name: "Administrador",
    description: "Control total del sistema",
    permissions: ["1", "2", "3", "4", "5"],
  },
  {
    id: "2",
    name: "Editor",
    description: "Puede editar y crear documentos",
    permissions: ["1", "2"],
  },
  {
    id: "3",
    name: "Lector",
    description: "Solo puede leer documentos",
    permissions: ["1"],
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissions] = useState<Permission[]>(initialPermissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrUpdateRole = (role: Role) => {
    if (editingRole) {
      setRoles(roles.map((r) => (r.id === role.id ? role : r)));
    } else {
      setRoles([...roles, { ...role, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <div className="container p-6 w-fit">
      <h1 className="text-3xl font-bold mb-6">Gestión de Roles</h1>

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRole(null)}>
              <Plus className="mr-2 h-4 w-4" /> Añadir Rol
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? "Editar Rol" : "Añadir Nuevo Rol"}
              </DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Modifica los detalles del rol aquí."
                  : "Crea un nuevo rol y asigna permisos."}
              </DialogDescription>
            </DialogHeader>
            <RoleForm
              role={
                editingRole || {
                  id: "",
                  name: "",
                  description: "",
                  permissions: [],
                }
              }
              permissions={permissions}
              onSave={handleAddOrUpdateRole}
            />
          </DialogContent>
        </Dialog>
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
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  {role.permissions
                    .map(
                      (permId) =>
                        permissions.find((p) => p.id === permId)?.description
                    )
                    .join(", ")}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRole(role.id)}
                  >
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
  role: Role;
  permissions: Permission[];
  onSave: (role: Role) => void;
};

function RoleForm({ role, permissions, onSave }: RoleFormProps) {
  const [formData, setFormData] = useState(role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nombre
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descripción
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right">Permisos</Label>
          <ScrollArea className="h-[200px] col-span-3">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center space-x-2 mb-2"
              >
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={formData.permissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionChange(permission.id)}
                />
                <label
                  htmlFor={`permission-${permission.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {permission.description}
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
