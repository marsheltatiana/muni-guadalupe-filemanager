"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { Rol, Usuario } from "@prisma/client";
import { Edit, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { UserUpdateForm } from "./user-update-form";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

interface UserListProps {
  className?: string;
  users: UserWithRol[];
  user: AuthenticatedUser;
}

export const UserList: React.FC<UserListProps> = ({
  className,
  users,
  user: authUser,
}) => {
  const router = useRouter();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast({
        title: "Éxito",
        description: "Usuario creado exitosamente",
      });

      router.refresh();
    } else {
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el usuario",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: number) => {
    const response = await fetch(`/api/usuarios?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast({
        title: "Éxito",
        description: "Usuario eliminado exitosamente",
      });

      router.refresh();
    } else {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nombre!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email!.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={className}>
      <section>
        {/* Búsqueda */}
        <div className="mb-6 w-full">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:max-w-72"
            />
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id_usuario}>
                  <TableCell className="font-medium">{user.nombre}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        bg-yellow-100 text-yellow-800`}
                    >
                      {user.Rol?.nombre_rol}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {hasAccess(authUser, Permission.EDIT_USERS) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <UserUpdateForm user={user} />
                        </DialogContent>
                      </Dialog>
                    )}
                    {hasAccess(authUser, Permission.DELETE_USERS) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id_usuario)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};
