"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Rol, Usuario } from "@prisma/client";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

interface UserListProps {
  className?: string;
}

export const UserList: React.FC<UserListProps> = ({ className }) => {
  const [users, setUsers] = useState<UserWithRol[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    async function fetchRoles(): Promise<void> {
      const roles: Rol[] = await fetch("/api/roles").then((res) => res.json());
      setRoles(roles);
    }

    fetchRoles();
  }, []);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    async function fetchUsers(): Promise<void> {
      const users: UserWithRol[] = await fetch("/api/usuarios").then((res) =>
        res.json()
      );
      setUsers(users);
    }

    fetchUsers();
  }, []);

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
    } else {
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el usuario",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (id: number) => {};

  const filteredUsers = users.filter(
    (user) =>
      user.nombre!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email!.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">Lista de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      disabled
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      onClick={() => handleDeleteUser(user.id_usuario)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
