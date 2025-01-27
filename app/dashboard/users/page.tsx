import { UserListLoader } from "@/components/loaders/user-list-loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserList } from "@/components/user-list";
import { UserRegistrationForm } from "@/components/user-registration-form";
import { auth } from "@/lib/auth";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { Rol, Usuario } from "@prisma/client";
import { Plus } from "lucide-react";
import { Suspense } from "react";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

const UsersPage = async () => {
  const session = await auth();

  const user = session?.user as AuthenticatedUser;

  if (!hasAccess(user, Permission.VIEW_USERS)) return;

  const users: UserWithRol[] = await fetch(
    `${process.env.APP_URL}/api/usuarios`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  return (
    <div className="w-full flex flex-col space-y-3">
      <section className="w-full flex justify-between">
        <section>
          <h3 className="font-bold text-xl">Gestion de Usuarios</h3>
        </section>
        {hasAccess(user, Permission.CREATE_USERS) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                Nuevo Usuario <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UserRegistrationForm className="lg:col-span-4 border-0 shadow-none" />
            </DialogContent>
          </Dialog>
        )}
      </section>

      <Suspense
        fallback={
          <UserListLoader className="lg:col-span-8 border-0 shadow-none" />
        }
      >
        <UserList className="border-0 shadow-none" users={users} user={user} />
      </Suspense>
    </div>
  );
};

export default UsersPage;
