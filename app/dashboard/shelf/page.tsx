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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Contenedor, Estante, Tipo_Contenedor } from "@prisma/client";
import { ArchiveIcon, EyeIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Container = {
  id: number;
  name: string;
  description: string;
  type: string;
  row: number;
  column: number;
};

type Shelf = {
  id: number;
  name: string;
  isEditing: boolean;
  rows: number;
  columns: number;
  containers: Container[];
};

interface EstanteConContenedores extends Estante {
  Contenedor: Contenedor[];
}

export default function ShelfManagement() {
  const router = useRouter();
  const [containerTypes, setContainerTypes] = useState<
    Tipo_Contenedor[] | null
  >(null);

  useEffect(() => {
    async function fetchContainerTypes() {
      const response = await fetch("/api/contenedor/tipos");
      const data = await response.json();

      setContainerTypes(data);
    }

    fetchContainerTypes();
  }, []);

  const [estantes, setEstantes] = useState<EstanteConContenedores[] | null>(
    null
  );

  const [nombreEstante, setNombreEstante] = useState("");

  useEffect(() => {
    async function fetchShelves() {
      const response = await fetch("/api/estantes");
      const data = await response.json();

      if (response.ok) {
        setEstantes(data);
      }
    }

    fetchShelves();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Estantes</h1>
      <Dialog>
        <DialogTrigger className="my-3" suppressHydrationWarning asChild>
          <Button>Registrar estante</Button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              const response = await fetch("/api/estantes", {
                method: "POST",
                body: JSON.stringify({
                  nombre_estante: formData.get("nombre_estante"),
                }),
              });

              if (response.ok) {
                toast({
                  title: "Éxito",
                  description: "Estante creado exitosamente",
                });
              } else {
                toast({
                  title: "Error",
                  description: "Hubo un error al crear el estante",
                  variant: "destructive",
                });
              }
              router.refresh();
            }}
          >
            <div className="grid gap-4 my-3">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre_estante"
                  name="nombre_estante"
                  value={nombreEstante}
                  onChange={(e) => setNombreEstante(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Estante</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {estantes?.map((estante) => (
            <Card
              key={estante.id_estante}
              className="transition-all hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>
                  <span className="text-lg font-bold">
                    {estante.nombre_estante}
                  </span>
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Button size="sm" variant="outline" onClick={() => {}}>
                    Editar
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <ArchiveIcon className="mr-2 h-4 w-4" />
                        Agregar Contenedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Contenedor</DialogTitle>
                        <DialogDescription>
                          Ingrese los detalles del nuevo contenedor para{" "}
                          {estante.nombre_estante}
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                        }}
                      >
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Nombre
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Descripción
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                              Tipo de Contenedor
                            </Label>
                            <Select>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccione tipo de contenedor" />
                              </SelectTrigger>
                              <SelectContent>
                                {containerTypes?.map((type) => (
                                  <SelectItem
                                    value={type.nombre!}
                                    key={type.id_tipo_contenedor}
                                  >
                                    {type.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div
                            id="customType"
                            style={{ display: "none" }}
                            className="grid grid-cols-4 items-center gap-4"
                          >
                            <Label
                              htmlFor="customTypeInput"
                              className="text-right"
                            >
                              Tipo personalizado
                            </Label>
                            <Input
                              id="customTypeInput"
                              name="customTypeInput"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="row" className="text-right">
                              Fila
                            </Label>
                            <Input
                              id="row"
                              name="row"
                              type="number"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="column" className="text-right">
                              Columna
                            </Label>
                            <Input
                              id="column"
                              name="column"
                              type="number"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Guardar Contenedor</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="w-full">
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Ver Contenido
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>
                        Contenido de {estante.nombre_estante}
                      </DialogTitle>
                      <DialogDescription>
                        Lista de todos los contenedores en este estante
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left font-medium">Nombre</th>
                            <th className="text-left font-medium">Tipo</th>
                            <th className="text-left font-medium">Fila</th>
                            <th className="text-left font-medium">Columna</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {shelf.containers.map((container) => (
                            <tr key={container.id}>
                              <td className="py-2">{container.name}</td>
                              <td className="py-2">{container.type}</td>
                              <td className="py-2">{container.row}</td>
                              <td className="py-2">{container.column}</td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                    </ScrollArea>
                    <DialogFooter>
                      <Button type="button" variant="secondary">
                        Cerrar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-6">
        <Button onClick={() => {}} className="w-full max-w-xs">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Nuevo Estante
        </Button>
      </div>
    </div>
  );
}
