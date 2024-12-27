import { DocumentListLoader } from "@/components/loaders/document-list-loader";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionsTable } from "@/components/transactions-table";
import { Documento, Rol, Transaccion, Usuario } from "@prisma/client";
import { Suspense } from "react";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

interface TransaccioUser extends Transaccion {
  Usuario: Usuario,
  Documento: Documento
}

const TransactionsPage = async () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      <TransactionForm usuarios={users} className="lg:col-span-4" />
      <Suspense fallback={<DocumentListLoader />}>
        <TransactionsTable
          transacciones={transacciones}
          className="lg:col-span-8"
        />
      </Suspense>
    </div>
  );
};

export default TransactionsPage;
