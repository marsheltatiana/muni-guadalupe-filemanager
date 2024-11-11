'use client'

import { useState, useEffect } from "react"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  type: string
}

type Shelf = {
  id: number
  name: string
  containers: Container[]
}

export function DocumentManagement() {
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [selectedShelf, setSelectedShelf] = useState<string>("")
  const [containers, setContainers] = useState<Container[]>([])
  const [selectedContainer, setSelectedContainer] = useState<string>("")
  const [hasTome, setHasTome] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [description, setDescription] = useState("")
  const [tomeNumber, setTomeNumber] = useState("1")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Simulated shelves data - replace with your actual data fetching logic
  useEffect(() => {
    setShelves([
      {
        id: 1,
        name: "Estante 1",
        containers: [
          { id: 1, name: "Contenedor 1", type: "archivador" },
          { id: 2, name: "Contenedor 2", type: "folder" },
        ],
      },
      {
        id: 2,
        name: "Estante 2",
        containers: [
          { id: 3, name: "Contenedor 3", type: "libro" },
          { id: 4, name: "Contenedor 4", type: "archivador" },
        ],
      },
    ])
  }, [])

  // Update containers when shelf is selected
  useEffect(() => {
    if (selectedShelf) {
      const shelf = shelves.find(s => s.id.toString() === selectedShelf)
      setContainers(shelf?.containers || [])
      setSelectedContainer("")
    } else {
      setContainers([])
    }
  }, [selectedShelf, shelves])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
    })
  }

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

            <div className="flex items-center space-x-2">
              <Switch
                id="tome"
                checked={hasTome}
                onCheckedChange={setHasTome}
              />
              <Label htmlFor="tome">¿Tiene tomo?</Label>
            </div>

            {hasTome && (
              <div className="grid gap-2">
                <Label htmlFor="tomeNumber">Número de Tomo</Label>
                <Input
                  id="tomeNumber"
                  type="number"
                  min="1"
                  value={tomeNumber}
                  onChange={(e) => setTomeNumber(e.target.value)}
                />
              </div>
            )}

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
              <Label htmlFor="shelf">Seleccionar Estante</Label>
              <Select
                value={selectedShelf}
                onValueChange={setSelectedShelf}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estante" />
                </SelectTrigger>
                <SelectContent>
                  {shelves.map((shelf) => (
                    <SelectItem key={shelf.id} value={shelf.id.toString()}>
                      {shelf.name}
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
                  {containers.map((container) => (
                    <SelectItem key={container.id} value={container.id.toString()}>
                      {container.name} ({container.type})
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
                  onClick={() => document.getElementById('file')?.click()}
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
  )
}