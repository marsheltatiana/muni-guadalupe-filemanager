'use client'

import { useState } from "react"
import { Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusIcon } from "@radix-ui/react-icons"

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

export function ShelfManagementComponent() {
  const [shelves, setShelves] = useState<Shelf[]>(Array.from({ length: 9 }, (_, i) => ({
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
    }
    setShelves([...shelves, newShelf])
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Gestión de Estantes</h1>
        <p className="text-muted-foreground">Administre los estantes y sus archivadores</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shelves.map((shelf) => (
          <Card key={shelf.id} className="border shadow-sm">
            <CardHeader className="pb-3">
              {shelf.isEditing ? (
                <Input
                  className="font-semibold"
                  defaultValue={shelf.name}
                  onBlur={(e) => handleSaveShelf(shelf.id, e.target.value)}
                  autoFocus
                />
              ) : (
                <CardTitle>{shelf.name}</CardTitle>
              )}
              <p className="text-sm text-muted-foreground">
                Filas: {shelf.rows} | Columnas: {shelf.columns} | Contenedores: {shelf.containers.length}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditShelf(shelf.id)}
                >
                  Editar
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Agregar Contenedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                        type: formData.get('type') as string,
                        row: parseInt(formData.get('row') as string),
                        column: parseInt(formData.get('column') as string),
                      }
                      handleAddContainer(shelf.id, newContainer)
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nombre</Label>
                          <Input id="name" name="name" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea id="description" name="description" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Tipo</Label>
                          <select id="type" name="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="archivador">Archivador</option>
                            <option value="folder">Folder</option>
                            <option value="libro">Libro</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="row">Fila</Label>
                          <Input type="number" id="row" name="row" min="1" max={shelf.rows} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="column">Columna</Label>
                          <Input type="number" id="column" name="column" min="1" max={shelf.columns} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Guardar Contenedor</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Contenido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Contenido de {shelf.name}</DialogTitle>
                    <DialogDescription>
                      Lista de todos los contenedores en este estante
                    </DialogDescription>
                  </DialogHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fila</TableHead>
                        <TableHead>Columna</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shelf.containers.map((container) => (
                        <TableRow key={container.id}>
                          <TableCell>{container.name}</TableCell>
                          <TableCell>{container.type}</TableCell>
                          <TableCell>{container.row}</TableCell>
                          <TableCell>{container.column}</TableCell>
                          <TableCell>{container.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button 
        className="mt-6 w-full bg-black text-white hover:bg-black/90" 
        onClick={handleAddShelf}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Agregar Nuevo Estante
      </Button>
    </div>
  )
}