"use client";

import { RoleListLoader } from "@/components/loaders/role-list-loader";
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
    <div className="w-full">
      <h3 className="font-bold text-xl">Gestión de roles y permisos</h3>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 mb-6">
        <div className="relative w-full md:w-fit top-2 mr-3">
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 "
            width={14}
            height={14}
          />
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

      <div className="w-full">
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
