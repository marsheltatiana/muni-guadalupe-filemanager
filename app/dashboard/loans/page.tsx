"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

// Simulación de datos de documentos
const documents = [
  { id: 1, name: "Documento 1", year: 2023, tomo: 1, estante: 1, fila: 1 },
  { id: 2, name: "Documento 2", year: 2023, tomo: 2, estante: 1, fila: 2 },
  { id: 3, name: "Documento 3", year: 2022, tomo: 1, estante: 2, fila: 1 },
  // Agrega más documentos según sea necesario
];
const LoansPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [action, setAction] = useState<"loan" | "return">("loan");
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <section>
      <Card className="w-full md:w-[450px]">
        <CardHeader>
          <CardTitle>Control de Préstamos y Devoluciones</CardTitle>
          <CardDescription>
            Registre préstamos y devoluciones de documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            defaultValue="loan"
            onValueChange={(value: string) =>
              setAction(value as "loan" | "return")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="loan" id="loan" />
              <Label htmlFor="loan">Préstamo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="return" id="return" />
              <Label htmlFor="return">Devolución</Label>
            </div>
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="document">Documento seleccionado</Label>
            <Input
              id="document"
              value={
                selectedDocument
                  ? documents.find((d) => d.id === selectedDocument)?.name
                  : ""
              }
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="person">Persona</Label>
            <Input id="person" placeholder="Nombre de la persona" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Cargo</Label>
            <Input id="position" placeholder="Cargo de la persona" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Fecha y Hora</Label>
            <Input id="date" type="datetime-local" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onSubmit}>
            {isLoading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {action === "loan" ? "Registrar Préstamo" : "Registrar Devolución"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoansPage;
