import { DocumentsTable } from "@/components/documents-table";
import { DocumentManagement } from "@/components/ui/document-management";

const DocumentsPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <DocumentManagement />
      <DocumentsTable />
    </div>
  );
};

export default DocumentsPage;
