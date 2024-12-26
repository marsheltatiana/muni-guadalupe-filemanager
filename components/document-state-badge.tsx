import { EstadoDocumento } from "@/lib/document-states";
import React from "react";
import { Badge } from "./ui/badge";

export const documentStateBadgeVariants = {
  DISPONIBLE: "bg-green-500 text-white",
  SOLICITADO: "bg-yellow-500 text-white",
  EN_REVISION: "bg-blue-500 text-white",
  PRESTADO: "bg-purple-500 text-white",
  VENCIDO: "bg-red-500 text-white",
};

export const getDocumentStateBadgeClass = (state: EstadoDocumento | null) => {
    if (!state) return "bg-gray-500 text-white";
    return documentStateBadgeVariants[state] || "bg-gray-500 text-white";
};

interface DocumentStateBadgeProps {
  state: EstadoDocumento | null;
}

export const DocumentStateBadge: React.FC<DocumentStateBadgeProps> = ({
  state,
}) => {
  return (
    <Badge className={getDocumentStateBadgeClass(state)}>
      <span>{state}</span>
    </Badge>
  );
};
