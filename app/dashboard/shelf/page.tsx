'use client'

import { useState } from "react"
import { PlusCircle, Edit2Icon, ArchiveIcon, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

type Container = {
  id: number
  name: string
  description: string
  type: string
  row: number
  column: number
}

type Shelf = {
  id: number
  name: string
  isEditing: boolean
  rows: number
  columns: number
  containers: Container[]
}

export default function ShelfManagement() {
  const [shelves, setShelves] = useState<Shelf[]>(Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Estante ${i + 1}`,
    isEditing: false,
    rows: 5,
    columns: 5,
    containers: [],
  })))

  const handleAddShelf = () => {
    const newShelf: Shelf = {
      id: shelves.length + 1,
      name: `Estante ${shelves.length + 1}`,
      isEditing: false,
      rows: 5,
      columns: 5,
      containers: [],
    };
    setShelves([...shelves, newShelf]);
  }

  const handleEditShelf = (id: number) => {
    setShelves(
      shelves.map((shelf) =>
        shelf.id === id ? { ...shelf, isEditing: true } : shelf
      )
    )
  }

  const handleSaveShelf = (id: number, newName: string) => {
    setShelves(
      shelves.map((shelf) =>
        shelf.id === id
          ? { ...shelf, name: newName, isEditing: false }
          : shelf
      )
    )
  }

  const handleAddContainer = (shelfId: number, container: { name: string; description: string; type: string; row: number; column: number }) => {
    setShelves(
      shelves.map((shelf) =>
        shelf.id === shelfId
          ? { ...shelf, containers: [...(shelf.containers || []), { ...container, id: shelf.containers.length + 1 }] }
          : shelf
      )
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Estantes</h1>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shelves.map((shelf) => (
            <Card key={shelf.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle>
                  {shelf.isEditing ? (
                    <Input
                      className="text-lg font-bold"
                      defaultValue={shelf.name}
                      onBlur={(e) => handleSaveShelf(shelf.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-lg font-bold">{shelf.name}</span>
                  )}
                </CardTitle>
                <CardDescription>
                  Filas: {shelf.rows} | Columnas: {shelf.columns} | Contenedores: {shelf.containers ? shelf.containers.length : 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      shelf.isEditing
                        ? handleSaveShelf(shelf.id, shelf.name)
                        : handleEditShelf(shelf.id)
                    }
                  >
                    {shelf.isEditing ? "Guardar" : "Editar"}
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
                          Ingrese los detalles del nuevo contenedor para {shelf.name}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const newContainer = {
                          name: formData.get('name') as string,
                          description: formData.get('description') as string,
                          type: formData.get('type') === 'otro' ? formData.get('customTypeInput') as string : formData.get('type') as string,
                          row: parseInt(formData.get('row') as string),
                          column: parseInt(formData.get('column') as string),
                        }
                        handleAddContainer(shelf.id, newContainer)
                      }}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Nombre
                            </Label>
                            <Input id="name" name="name" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Descripción
                            </Label>
                            <Textarea id="description" name="description" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                              Tipo de Contenedor
                            </Label>
                            <select id="type" name="type" className="col-span-3 form-select" onChange={(e) => {
                              if (e.target.value === "otro") {
                                document.getElementById("customType").style.display = "block";
                              } else {
                                document.getElementById("customType").style.display = "none";
                              }
                            }}>
                              <option value="archivador">Archivador</option>
                              <option value="folder">Folder</option>
                              <option value="libro">Libro</option>
                              <option value="otro">Otro</option>
                            </select>
                          </div>
                          <div id="customType" style={{ display: 'none' }} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customTypeInput" className="text-right">
                              Tipo personalizado
                            </Label>
                            <Input id="customTypeInput" name="customTypeInput" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="row" className="text-right">
                              Fila
                            </Label>
                            <Input id="row" name="row" type="number" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="column" className="text-right">
                              Columna
                            </Label>
                            <Input id="column" name="column" type="number" className="col-span-3" />
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
                      <DialogTitle>Contenido de {shelf.name}</DialogTitle>
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
                          {shelf.containers.map((container) => (
                            <tr key={container.id}>
                              <td className="py-2">{container.name}</td>
                              <td className="py-2">{container.type}</td>
                              <td className="py-2">{container.row}</td>
                              <td className="py-2">{container.column}</td>
                            </tr>
                          ))}
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
        <Button onClick={handleAddShelf} className="w-full max-w-xs">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Nuevo Estante
        </Button>
      </div>
    </div>
  )
}