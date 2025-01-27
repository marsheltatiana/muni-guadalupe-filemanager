import { DocumentListLoader } from "@/components/loaders/document-list-loader";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionsTable } from "@/components/transactions-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { Documento, Rol, Transaccion, Usuario } from "@prisma/client";
import { Plus } from "lucide-react";
import { Suspense } from "react";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

interface TransaccioUser extends Transaccion {
  Usuario: Usuario;
  Documento: Documento;
}

const TransactionsPage = async () => {
  const session = await auth();

  const user = session?.user as AuthenticatedUser;

  if (!hasAccess(user, Permission.CREATE_TRANSACTION)) return;

  const users: UserWithRol[] = await fetch(
    `${process.env.APP_URL}/api/usuarios`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const transacciones: TransaccioUser[] = await fetch(
    `${process.env.APP_URL}/api/transacciones`,
    {
      cache: "no-cache",
    }
  )
    .then((res) => res.json())
    .catch((e) => console.error(e));

  return (
    <div className="w-full flex flex-col space-y-3">
      <section className="w-full flex justify-between">
        <section>
          <h3 className="font-bold text-xl">Gestion de Transacciones</h3>
        </section>
        {hasAccess(user, Permission.CREATE_TRANSACTION) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                Nueva Transacción <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <TransactionForm usuarios={users} className="lg:col-span-4" />
            </DialogContent>
          </Dialog>
        )}
      </section>

      <Suspense fallback={<DocumentListLoader />}>
        <TransactionsTable transacciones={transacciones} />
      </Suspense>
    </div>
  );
};

export default TransactionsPage;
