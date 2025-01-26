"use client";

import { RoleListLoader } from "@/components/loaders/role-list-loader";
import { NewPermissionDialog } from "@/components/permissions/new-permission-dialog";
import { EditRolDialog } from "@/components/roles/edit-rol-dialog";
import { NewRolDialog } from "@/components/roles/new-rol-dialog";
import { RolesTable } from "@/components/roles/roles-table";
import { Input } from "@/components/ui/input";
import { Permisos, Rol, Rol_Permisos } from "@prisma/client";
import { Search } from "lucide-react";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [rolSelected, setRolSelected] = useState<RolWithPermissions | null>(
    null
  );

  const filteredRoles = React.useMemo(
    () =>
      roles.filter(
        (role) =>
          role.nombre_rol!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [roles, searchTerm]
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
          {/* <NewPermissionDialog
            isPermissionDialogOpen={isPermissionDialogOpen}
            setIsPermissionDialogOpen={setIsPermissionDialogOpen}
          /> */}
          <NewRolDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            permisos={permisos}
          />
          <EditRolDialog
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            permissions={permisos}
            rolSelected={rolSelected}
          />
        </section>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Suspense fallback={<RoleListLoader />}>
          <RolesTable
            roles={roles}
            filteredRoles={filteredRoles}
            setRolSelected={setRolSelected}
            setIsEditDialogOpen={setIsEditDialogOpen}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default RolesClientPage;
