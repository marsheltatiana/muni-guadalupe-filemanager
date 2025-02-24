"use client"

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DocumentManagement } from "../ui/document-management";
import { useState } from "react";

export const CreateDocumentDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Nuevo Documento <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DocumentManagement setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};
