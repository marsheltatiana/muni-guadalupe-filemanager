import { DocumentsTable } from "@/components/documents-table";
import { DocumentListLoader } from "@/components/loaders/document-list-loader";
import { DocumentManagement } from "@/components/ui/document-management";
import { Categoria_Documento, Contenedor, Documento } from "@prisma/client";
import { Suspense } from "react";

interface DocumentoWithContenedorCategoria extends Documento {
  Contenedor: Contenedor;
  Categoria_Documento: Categoria_Documento;
}

const DocumentsPage = async () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <DocumentManagement />

      <Suspense fallback={<DocumentListLoader />}>
        <DocumentsTable documents={documents} />
      </Suspense>
    </div>
  );
};

export default DocumentsPage;
