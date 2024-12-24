import { UserListLoader } from "@/components/loaders/user-list-loader";
import { UserList } from "@/components/user-list";
import { UserRegistrationForm } from "@/components/user-registration-form";
import { Rol, Usuario } from "@prisma/client";
import { Suspense } from "react";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

const UsersPage = async () => {
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
