"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { createContainerSchema, createShelfSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contenedor, Estante, Tipo_Contenedor } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Grid,
  List,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ContenedorWithTipo extends Contenedor {
  Tipo_Contenedor: Tipo_Contenedor;
}

interface EstanteWithContainers extends Estante {
  Contenedor: ContenedorWithTipo[];
}

type ShelfManagementProps = {
  shelves: EstanteWithContainers[];
  containerTypes: Tipo_Contenedor[];
  user: AuthenticatedUser;
};

export const ShelfManagement: React.FC<ShelfManagementProps> = ({
  shelves,
  containerTypes,
  user,
}) => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");
  const [expandedShelves, setExpandedShelves] = useState<Set<number>>(
    new Set()
  );
  const [isNewShelfDialogOpen, setIsNewShelfDialogOpen] = useState(false);
  const [isNewContainerDialogOpen, setIsNewContainerDialogOpen] =
    useState(false);
  const [isEditContainerDialogOpen, setIsEditContainerDialogOpen] =
    useState(false);
  const [editContainerItem, setEditContainerItem] = useState<Contenedor | null>(
    null
  );
  const [selectedShelfId, setSelectedShelfId] = useState<number | null>(null);

  const filteredShelves = shelves?.filter(
    (shelf) =>
      shelf.nombre_estante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelf.Contenedor.some((container) =>
        container.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const toggleShelfExpansion = (shelfId: number) => {
    setExpandedShelves((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(shelfId)) {
        newSet.delete(shelfId);
      } else {
        newSet.add(shelfId);
      }
      return newSet;
    });
  };

  const shelfForm = useForm<z.infer<typeof createShelfSchema>>({
    resolver: zodResolver(createShelfSchema),
    defaultValues: {
      nombre_estante: "",
    },
  });

  const containerForm = useForm<z.infer<typeof createContainerSchema>>({
    resolver: zodResolver(createContainerSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      anio: "",
      fila: "",
      columna: "",
    },
  });

  const editContainerForm = useForm<z.infer<typeof createContainerSchema>>({
    resolver: zodResolver(createContainerSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      anio: "",
      fila: "",
      columna: "",
      tipo_contenedor_id: "",
    },
  });

  React.useEffect(() => {
    if (editContainerItem) {
      editContainerForm.reset({
        nombre: editContainerItem.nombre || "",
        descripcion: editContainerItem.descripcion || "",
        anio: editContainerItem.anio || "",
        fila: editContainerItem.fila || "",
        columna: editContainerItem.columna || "",
        tipo_contenedor_id:
          editContainerItem.tipo_contenedor_id?.toString() || "",
      });
    }
  }, [editContainerForm, editContainerItem]);

  const onSubmitShelf = async (values: z.infer<typeof createShelfSchema>) => {
    try {
      const response = await fetch("/api/estantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to create shelf");
      setIsNewShelfDialogOpen(false);

      toast({
        title: "Éxito 🎉",
        description: "Estante creado correctamente ✅",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error 😞",
        description: "No se pudo crear el estante",
        variant: "destructive",
      });
    }
  };

  const onSubmitContainer = async (
    values: z.infer<typeof createContainerSchema>
  ) => {
    if (!selectedShelfId) return;
    try {
      const response = await fetch(
        `/api/contenedor?estante_id=${selectedShelfId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) throw new Error("Failed to create container");
      setIsNewContainerDialogOpen(false);

      toast({
        title: "Éxito 🎉",
        description: "Contenedor creado correctamente ✅",
      });

      containerForm.reset();

      router.refresh();
    } catch (error) {
      console.error("Error creating container:", error);
      toast({
        title: "Error 😞",
        description: "No se pudo crear el contenedor",
        variant: "destructive",
      });
    }
  };

  const onSubmitEditContainer = async (
    values: z.infer<typeof createContainerSchema>
  ) => {
    try {
      const response = await fetch(
        `/api/contenedor?contenedor_id=${editContainerItem?.id_contenedor}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) throw new Error("Failed to create container");
      setIsNewContainerDialogOpen(false);

      toast({
        title: "Éxito 🎉",
        description: "Contenedor actualizado correctamente ✅",
      });

      editContainerForm.reset();

      router.refresh();

      setIsEditContainerDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error 😞",
        description: "No se pudo actualizar el contenedor",
        variant: "destructive",
      });
    }
  };

  const renderTreeView = () => (
    <ScrollArea className="h-[calc(100vh-200px)]">
      {filteredShelves && filteredShelves.length > 0 ? (
        filteredShelves.map((shelf) => (
          <Collapsible
            key={shelf.id_estante}
            open={expandedShelves.has(shelf.id_estante)}
            onOpenChange={() => toggleShelfExpansion(shelf.id_estante)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                {expandedShelves.has(shelf.id_estante) ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                {shelf.nombre_estante || `Estante ${shelf.id_estante}`}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AnimatePresence>
                {shelf.Contenedor.map((container) => (
                  <motion.div
                    key={container.id_contenedor}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="m-2">
                      <CardContent className="p-4">
                        <h4 className="font-semibold">
                          {container.nombre ||
                            `Contenedor ${container.id_contenedor}`}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {container.descripcion || "Sin descripción"}
                        </p>
                        <p className="text-xs text-gray-400 underline">
                          {container.Tipo_Contenedor?.nombre || "N/A"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Año:{" "}
                          {container.anio
                            ? new Date(container.anio).getFullYear()
                            : "N/A"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Fila: {container.fila} | Columna:{" "}
                          {container.columna || "N/A"}
                        </p>
                      </CardContent>
                      <CardFooter>
                        {hasAccess(user, Permission.DELETE_SHELVES) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2"
                            onClick={async () => {
                              try {
                                const response = await fetch(
                                  `/api/contenedor/?contenedor_id=${container.id_contenedor}`,
                                  {
                                    method: "DELETE",
                                  }
                                );

                                if (response.ok) {
                                  router.refresh();

                                  toast({
                                    title: "Contenedor eliminado!",
                                    description: `El Contenedor  ${container.nombre} ha sido eliminado exitosamente.`,
                                  });
                                } else {
                                  const errorData = await response.json();
                                  toast({
                                    title: "Error al eliminar el contenedor",
                                    description:
                                      errorData.message ||
                                      "Ocurrió un error desconocido.",
                                    variant: "destructive",
                                  });
                                }
                              } catch (error) {
                                toast({
                                  title: "Error de red",
                                  description:
                                    "No se pudo conectar al servidor. Inténtalo de nuevo más tarde.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar Contenedor
                          </Button>
                        )}
                        {hasAccess(user, Permission.EDIT_SHELVES) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => {
                              setEditContainerItem(container);
                              setIsEditContainerDialogOpen(true);
                            }}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Editar Contenedor
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex gap-3">
                {hasAccess(user, Permission.CREATE_SHELVES) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      setSelectedShelfId(shelf.id_estante);
                      setIsNewContainerDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Contenedor al Estante
                  </Button>
                )}
                {hasAccess(user, Permission.DELETE_SHELVES) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={async () => {
                      const estanteId = shelf.id_estante; // Asegúrate de que `estante` sea la variable que contiene el objeto.

                      try {
                        // Llamada a la API para eliminar el estante
                        const response = await fetch(
                          `/api/estantes/?id=${estanteId}`,
                          {
                            method: "DELETE",
                          }
                        );

                        if (response.ok) {
                          router.refresh(); // Actualiza la página o la lista de estantes

                          toast({
                            title: "Estante eliminado!",
                            description: `El estante con ID ${estanteId} ha sido eliminado exitosamente.`,
                          });
                        } else {
                          const errorData = await response.json();
                          toast({
                            title: "Error al eliminar el estante",
                            description:
                              errorData.message ||
                              "Ocurrió un error desconocido.",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Error de red",
                          description:
                            "No se pudo conectar al servidor. Inténtalo de nuevo más tarde.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar todo el estante
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <div>No hay estantes disponibles</div>
      )}
    </ScrollArea>
  );

  const renderGridView = () => (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredShelves.map((shelf) => (
          <Card key={shelf.id_estante} className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {shelf.nombre_estante || `Estante ${shelf.id_estante}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full justify-start p-4"
                onClick={() => toggleShelfExpansion(shelf.id_estante)}
              >
                {expandedShelves.has(shelf.id_estante)
                  ? "Ocultar Contenedores"
                  : "Mostrar Contenedores"}
              </Button>
              <AnimatePresence>
                {expandedShelves.has(shelf.id_estante) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 p-4 bg-gray-100">
                      {shelf.Contenedor.map((container) => (
                        <Card
                          key={container.id_contenedor}
                          className="flex flex-col justify-between"
                          style={{
                            gridRow: `span ${container.fila}`,
                            gridColumn: `span ${container.columna || 1}`,
                          }}
                        >
                          <CardContent className="p-2">
                            <h5 className="font-semibold text-sm">
                              {container.nombre ||
                                `Contenedor ${container.id_contenedor}`}
                            </h5>
                            <p className="text-xs text-gray-500 truncate">
                              {container.descripcion || "Sin descripción"}
                            </p>
                            <p className="text-xs text-gray-400 underline">
                              {container.Tipo_Contenedor?.nombre || "N/A"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {container.anio
                                ? new Date(container.anio).getFullYear()
                                : "N/A"}
                            </p>
                          </CardContent>
                          <CardFooter className="flex flex-col gap-1">
                            {hasAccess(user, Permission.DELETE_SHELVES) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-2"
                                onClick={async () => {
                                  try {
                                    // Llamada a la API para eliminar el estante
                                    const response = await fetch(
                                      `/api/contenedor/?contenedor_id=${container.id_contenedor}`,
                                      {
                                        method: "DELETE",
                                      }
                                    );

                                    if (response.ok) {
                                      router.refresh(); // Actualiza la página o la lista de estantes

                                      toast({
                                        title: "Contenedor eliminado!",
                                        description: `El Contenedor  ${container.nombre} ha sido eliminado exitosamente.`,
                                      });
                                    } else {
                                      const errorData = await response.json();
                                      toast({
                                        title:
                                          "Error al eliminar el contenedor",
                                        description:
                                          errorData.message ||
                                          "Ocurrió un error desconocido.",
                                        variant: "destructive",
                                      });
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Error de red",
                                      description:
                                        "No se pudo conectar al servidor. Inténtalo de nuevo más tarde.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </Button>
                            )}
                            {hasAccess(user, Permission.EDIT_SHELVES) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => {
                                  setEditContainerItem(container);
                                  setIsEditContainerDialogOpen(true);
                                }}
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Editar
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {hasAccess(user, Permission.CREATE_SHELVES) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => {
                            setSelectedShelfId(shelf.id_estante);
                            setIsNewContainerDialogOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Contenedor
                        </Button>
                      )}
                      {hasAccess(user, Permission.DELETE_SHELVES) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2"
                          onClick={async () => {
                            const estanteId = shelf.id_estante; // Asegúrate de que `estante` sea la variable que contiene el objeto.

                            try {
                              // Llamada a la API para eliminar el estante
                              const response = await fetch(
                                `/api/estantes/?id=${estanteId}`,
                                {
                                  method: "DELETE",
                                }
                              );

                              if (response.ok) {
                                router.refresh(); // Actualiza la página o la lista de estantes

                                toast({
                                  title: "Estante eliminado!",
                                  description: `El estante con ID ${estanteId} ha sido eliminado exitosamente.`,
                                });
                              } else {
                                const errorData = await response.json();
                                toast({
                                  title: "Error al eliminar el estante",
                                  description:
                                    errorData.message ||
                                    "Ocurrió un error desconocido.",
                                  variant: "destructive",
                                });
                              }
                            } catch (error) {
                              toast({
                                title: "Error de red",
                                description:
                                  "No se pudo conectar al servidor. Inténtalo de nuevo más tarde.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-4 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-3">
        <h3 className="font-bold text-xl">Gestión de Estantes</h3>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "tree" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("tree")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          {hasAccess(user, Permission.CREATE_SHELVES) && (
            <Button onClick={() => setIsNewShelfDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Estante
            </Button>
          )}
        </div>
      </div>
      <div className="relative mb-6 w-full lg:w-[45%]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar estantes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      {viewMode === "tree" ? renderTreeView() : renderGridView()}

      <Dialog
        open={isNewShelfDialogOpen}
        onOpenChange={setIsNewShelfDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Estante</DialogTitle>
            <DialogDescription>
              Ingrese el nombre del nuevo estante.
            </DialogDescription>
          </DialogHeader>
          <Form {...shelfForm}>
            <form
              onSubmit={shelfForm.handleSubmit(onSubmitShelf)}
              className="space-y-8"
            >
              <FormField
                control={shelfForm.control}
                name="nombre_estante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Estante</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre del estante"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Este será el nombre visible del estante.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Crear Estante</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isNewContainerDialogOpen}
        onOpenChange={setIsNewContainerDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Contenedor</DialogTitle>
            <DialogDescription>
              Ingrese los detalles del nuevo contenedor.
            </DialogDescription>
          </DialogHeader>
          <Form {...containerForm}>
            <form
              onSubmit={containerForm.handleSubmit(onSubmitContainer)}
              className="space-y-8"
            >
              <FormField
                control={containerForm.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Contenedor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre del contenedor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={containerForm.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción del contenedor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={containerForm.control}
                name="anio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        maxLength={4}
                        min={1800}
                        placeholder="2025"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={containerForm.control}
                name="fila"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fila</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Fila del contenedor"
                        {...field}
                        type="number"
                        min={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={containerForm.control}
                name="columna"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Columna</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Columna del contenedor"
                        {...field}
                        type="number"
                        min={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={containerForm.control}
                name="tipo_contenedor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contenedor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {containerTypes.map((containerType) => (
                          <SelectItem
                            key={containerType.id_tipo_contenedor}
                            value={containerType.id_tipo_contenedor.toString()}
                          >
                            {containerType.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el tipo de contenedor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Crear Contenedor</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditContainerDialogOpen}
        onOpenChange={setIsEditContainerDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contenedor</DialogTitle>
            <DialogDescription>
              Ingrese los detalles de los nuevos datos del contenedor.
            </DialogDescription>
          </DialogHeader>
          <Form {...editContainerForm}>
            <form
              onSubmit={editContainerForm.handleSubmit(onSubmitEditContainer)}
              className="space-y-8"
            >
              <FormField
                control={editContainerForm.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Contenedor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Ingrese el nombre del contenedor ${field.value}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editContainerForm.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción del contenedor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editContainerForm.control}
                name="anio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        maxLength={4}
                        pattern="202[4-9]"
                        placeholder="2024"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editContainerForm.control}
                name="fila"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fila</FormLabel>
                    <FormControl>
                      <Input placeholder="Fila del contenedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editContainerForm.control}
                name="columna"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Columna</FormLabel>
                    <FormControl>
                      <Input placeholder="Columna del contenedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editContainerForm.control}
                name="tipo_contenedor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contenedor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {containerTypes.map((containerType) => (
                          <SelectItem
                            key={containerType.id_tipo_contenedor}
                            value={containerType.id_tipo_contenedor.toString()}
                          >
                            {containerType.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el tipo de contenedor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Actualizar Contenedor</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
