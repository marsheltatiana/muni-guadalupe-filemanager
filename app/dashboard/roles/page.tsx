import { auth } from "@/lib/auth";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { Permisos, Rol, Rol_Permisos } from "@prisma/client";
import RolesClientPage from "./page.client";

interface Rol_PermisosWithPermiso extends Rol_Permisos {
  Permisos: Permisos;
}

interface RolWithPermissions extends Rol {
  Rol_Permisos: Rol_PermisosWithPermiso[];
}

export default async function RolesPage() {
  const roles: RolWithPermissions[] = await fetch(
    `${process.env.APP_URL}/api/roles`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const permissions: Permisos[] = await fetch(
    `${process.env.APP_URL}/api/permisos`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const session = await auth();

  const user = session?.user as AuthenticatedUser;

  if (!hasAccess(user, Permission.VIEW_ROLES)) return;

  return <RolesClientPage roles={roles} permisos={permissions} />;
}
