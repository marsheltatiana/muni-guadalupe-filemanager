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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Categoria_Documento, Contenedor, Estante } from "@prisma/client";
import { FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";

interface EstanteWithContainers extends Estante {
  Contenedor: Contenedor[];
}

export function DocumentManagement() {
  const [shelves, setShelves] = useState<EstanteWithContainers[]>([]);
  const [selectedShelf, setSelectedShelf] =
    useState<EstanteWithContainers | null>(null);
  const [containers, setContainers] = useState<Contenedor[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>("");
  const [hasTome, setHasTome] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [tomeNumber, setTomeNumber] = useState("1");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  //////////////////////////////////////

  const [categories, setCategories] = useState<Categoria_Documento[] | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
    fetch("/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    fetch("/api/estantes")
      .then((res) => res.json())
      .then((data) => setShelves(data));
  }, []);

  // // Update containers when shelf is selected
  // useEffect(() => {
  //   if (selectedShelf) {
  //     const shelf = shelves.find((s) => s.id.toString() === selectedShelf);
  //     setContainers(shelf?.containers || []);
  //     setSelectedContainer("");
  //   } else {
  //     setContainers([]);
  //   }
  // }, [selectedShelf, shelves]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle document registration logic here
    console.log({
      documentName,
      description,
      hasTome,
      tomeNumber,
      year,
      selectedShelf,
      selectedContainer,
      selectedFile,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registro de Documento</CardTitle>
        <CardDescription>
          Complete los detalles del documento para registrarlo en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="documentName">Nombre del documento</Label>
              <Input
                id="documentName"
                placeholder="Ingrese el nombre del documento"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Breve descripción del documento"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shelf">Seleccionar Categoria</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id_categoria}
                      value={category.nombre_categoria!}
                    >
                      {category.nombre_categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shelf">Seleccionar Estante</Label>
              <Select
                value={selectedShelf?.nombre_estante!}
                onValueChange={(e) => {
                  setSelectedShelf(
                    shelves.find((shelf) => shelf.nombre_estante === e)!
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estante" />
                </SelectTrigger>
                <SelectContent>
                  {shelves.map((shelf) => (
                    <SelectItem
                      key={shelf.id_estante}
                      value={shelf.nombre_estante!}
                    >
                      {shelf.nombre_estante}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="container">Seleccionar Contenedor</Label>
              <Select
                value={selectedContainer}
                onValueChange={setSelectedContainer}
                disabled={!selectedShelf}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un contenedor" />
                </SelectTrigger>
                <SelectContent>
                  {selectedShelf?.Contenedor &&
                    selectedShelf.Contenedor.length > 0 &&
                    (selectedShelf.Contenedor ?? []).map((container) => (
                      <SelectItem
                        key={container.id_contenedor}
                        value={container.nombre!}
                      >
                        {container.nombre} (Fila: {container.fila}, Columna: {container.columna})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="file">Subir archivo PDF</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file")?.click()}
                  className="w-full"
                  disabled={!selectedContainer}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar archivo PDF
                </Button>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">
                    {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Registrar Documento
        </Button>
      </CardFooter>
    </Card>
  );
}
