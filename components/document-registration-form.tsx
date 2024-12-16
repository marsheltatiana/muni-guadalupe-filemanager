"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PutBlobResult } from "@vercel/blob";
import { AlertCircle, FileUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DocumentRegistrationForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    documentName: "",
    description: "",
    fileName: "",
    hasVolume: false,
    volumeNumber: "",
    year: "",
    shelfNumber: "",
    rowNumber: "",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hasVolume: checked,
      volumeNumber: checked ? prev.volumeNumber : "",
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
        setError(null);
      } else {
        setPdfFile(null);
        setError("Por favor, seleccione un archivo PDF válido.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!pdfFile) {
      setError("Por favor, seleccione un archivo PDF para subir.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/subir-pdf?filename=${formData.fileName}`,
        {
          method: "POST",
          body: pdfFile,
        }
      );

      const newBlob = (await response.json()) as PutBlobResult;

      setBlob(newBlob);

      toast({
        title: "Documento registrado ✅",
      });

      // Reset form after successful submission
      setFormData({
        documentName: "",
        description: "",
        fileName: "",
        hasVolume: false,
        volumeNumber: "",
        year: "",
        shelfNumber: "",
        rowNumber: "",
      });
      setPdfFile(null);
    } catch (error) {
      console.log(error);
      setError(
        "Hubo un error al registrar el documento. Por favor, intente de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Registro de Documento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="documentName">Nombre del documento</Label>
              <Input
                id="documentName"
                name="documentName"
                value={formData.documentName}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre del documento"
                required
              />
            </div>
            <div>
              <Label htmlFor="fileName">Nombre del archivo</Label>
              <Input
                id="fileName"
                name="fileName"
                value={formData.fileName}
                onChange={handleInputChange}
                placeholder="Nombre del archivo para guardar"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Breve descripción del documento"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="YYYY"
              />
            </div>
            <div>
              <Label htmlFor="shelfNumber">Número de Estante</Label>
              <Input
                id="shelfNumber"
                name="shelfNumber"
                value={formData.shelfNumber}
                onChange={handleInputChange}
                placeholder="Número de estante"
              />
            </div>
            <div>
              <Label htmlFor="rowNumber">Número de Fila</Label>
              <Input
                id="rowNumber"
                name="rowNumber"
                value={formData.rowNumber}
                onChange={handleInputChange}
                placeholder="Número de fila"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pdfUpload">Subir archivo PDF</Label>
            <div className="mt-1 flex items-center">
              <Input
                id="pdfUpload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="pdfUpload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FileUp className="h-5 w-5 mr-2" />
                Seleccionar archivo PDF
              </Label>
              {pdfFile && (
                <span className="ml-3 text-sm text-gray-500">
                  {pdfFile.name}
                </span>
              )}
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrar Documento"
            )}
          </Button>
        </form>
      </CardContent>
      {blob && (
        <div>
          URL del archivo:{" "}
          <Link href={blob.url} target="_blank">
            {blob.url}
          </Link>
        </div>
      )}
    </Card>
  );
}
