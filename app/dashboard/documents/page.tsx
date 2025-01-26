import { DocumentsTable } from "@/components/documents-table";
import { DocumentListLoader } from "@/components/loaders/document-list-loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DocumentManagement } from "@/components/ui/document-management";
import { auth } from "@/lib/auth";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { Categoria_Documento, Contenedor, Documento } from "@prisma/client";
import { Plus } from "lucide-react";
import { Suspense } from "react";

interface DocumentoWithContenedorCategoria extends Documento {
  Contenedor: Contenedor;
  Categoria_Documento: Categoria_Documento;
}

const DocumentsPage = async () => {
  const session = await auth();

  const user = session?.user as AuthenticatedUser;

  if (!hasAccess(user, Permission.VIEW_DOCUMENTS)) return;

  const documents: DocumentoWithContenedorCategoria[] | undefined = await fetch(
    `${process.env.APP_URL}/api/documentos`,
    {
      cache: "no-cache",
    }
  )
    .then(async (res) => {
      if (!res.ok) return undefined;
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });

  return (
    <div className="w-full flex flex-col space-y-3">
      <section className="w-full flex justify-between">
        <section>
          <h3 className="font-bold text-xl">Gestion de Documentos</h3>
        </section>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Nuevo Documento <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DocumentManagement />
          </DialogContent>
        </Dialog>
      </section>

      <Suspense fallback={<DocumentListLoader />}>
        <DocumentsTable documents={documents} />
      </Suspense>
    </div>
  );
};

export default DocumentsPage;
