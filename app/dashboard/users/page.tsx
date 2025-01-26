import { UserListLoader } from "@/components/loaders/user-list-loader";
import { UserList } from "@/components/user-list";
import { UserRegistrationForm } from "@/components/user-registration-form";
import { auth } from "@/lib/auth";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { Rol, Usuario } from "@prisma/client";
import { Suspense } from "react";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

const UsersPage = async () => {
  const session = await auth();

  const user = session?.user as AuthenticatedUser;

  if (!hasAccess(user, Permission.VIEW_DOCUMENTS)) return;

  const users: UserWithRol[] = await fetch(
    `${process.env.APP_URL}/api/usuarios`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      <UserRegistrationForm className="lg:col-span-4" />
      <Suspense fallback={<UserListLoader className="lg:col-span-8" />}>
        <UserList className="lg:col-span-8" users={users} />
      </Suspense>
    </section>
  );
};

export default UsersPage;
