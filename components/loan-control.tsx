'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Simulación de datos de documentos
const documents = [
  { id: 1, name: "Documento 1", year: 2023, tomo: 1, estante: 1, fila: 1 },
  { id: 2, name: "Documento 2", year: 2023, tomo: 2, estante: 1, fila: 2 },
  { id: 3, name: "Documento 3", year: 2022, tomo: 1, estante: 2, fila: 1 },
  // Agrega más documentos según sea necesario
]

// Simulación de datos de préstamos
const loans = [
  { id: 1, documentName: "Documento 1", personName: "Juan Pérez", position: "Analista", date: "2023-06-01", status: "Prestado" },
  { id: 2, documentName: "Documento 2", personName: "María García", position: "Gerente", date: "2023-05-28", status: "Devuelto" },
  { id: 3, documentName: "Documento 3", personName: "Carlos López", position: "Coordinador", date: "2023-06-03", status: "Prestado" },
  // Agrega más préstamos según sea necesario
]

export default function LoanControl() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [action, setAction] = useState<'loan' | 'return'>('loan')
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <Tabs defaultValue="control" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="control">Control de Préstamos</TabsTrigger>
        <TabsTrigger value="list">Lista de Préstamos</TabsTrigger>
      </TabsList>
      <TabsContent value="control">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="w-full md:w-[450px]">
            <CardHeader>
              <CardTitle>Control de Préstamos y Devoluciones</CardTitle>
              <CardDescription>Registre préstamos y devoluciones de documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup defaultValue="loan" onValueChange={(value: string) => setAction(value as 'loan' | 'return')}>
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
                  value={selectedDocument ? documents.find(d => d.id === selectedDocument)?.name : ''} 
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {action === 'loan' ? 'Registrar Préstamo' : 'Registrar Devolución'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full md:w-[600px]">
            <CardHeader>
              <CardTitle>Lista de Documentos</CardTitle>
              <CardDescription>Seleccione un documento para el préstamo o devolución</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>Tomo</TableHead>
                      <TableHead>Estante</TableHead>
                      <TableHead>Fila</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.year}</TableCell>
                        <TableCell>{doc.tomo}</TableCell>
                        <TableCell>{doc.estante}</TableCell>
                        <TableCell>{doc.fila}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedDocument(doc.id)}
                          >
                            Seleccionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="list">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Préstamos Actuales</CardTitle>
            <CardDescription>Estado de los préstamos en curso</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>{loan.documentName}</TableCell>
                      <TableCell>{loan.personName}</TableCell>
                      <TableCell>{loan.position}</TableCell>
                      <TableCell>{loan.date}</TableCell>
                      <TableCell>{loan.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}