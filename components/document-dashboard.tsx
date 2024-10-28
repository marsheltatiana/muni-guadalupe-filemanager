'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, SortAsc, SortDesc } from "lucide-react"

// This would typically come from an API or database
const initialDocuments = [
  { id: 1, name: "Informe Anual 2023", fileName: "informe_anual_2023.pdf", description: "Reporte financiero del año 2023", year: 2023, hasVolume: true, volumeNumber: 1 },
  { id: 2, name: "Contrato de Arrendamiento", fileName: "contrato_arrendamiento_local_A.pdf", description: "Contrato de arrendamiento para el local comercial A", year: 2024, hasVolume: false },
  { id: 3, name: "Acta de Reunión Directiva", fileName: "acta_reunion_directiva_enero.pdf", description: "Acta de la reunión de directiva de enero", year: 2024, hasVolume: true, volumeNumber: 2 },
  { id: 4, name: "Presupuesto 2024", fileName: "presupuesto_2024.pdf", description: "Planificación presupuestaria para el año 2024", year: 2024, hasVolume: false },
  { id: 5, name: "Manual de Procedimientos", fileName: "manual_procedimientos_v2.pdf", description: "Manual actualizado de procedimientos internos", year: 2023, hasVolume: true, volumeNumber: 3 },
]

type SortField = 'name' | 'fileName' | 'year'

export default function DocumentDashboard() {
  const [documents, setDocuments] = useState(initialDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedAndFilteredDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Dashboard de Documentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={sortField}
            onValueChange={(value: SortField) => handleSort(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="fileName">Nombre de archivo</SelectItem>
              <SelectItem value="year">Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  Nombre
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('name')}>
                    {sortField === 'name' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </Button>
                </TableHead>
                <TableHead className="w-[300px]">
                  Nombre de archivo
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('fileName')}>
                    {sortField === 'fileName' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  Año
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('year')}>
                    {sortField === 'year' && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">Tomo</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>{doc.year}</TableCell>
                  <TableCell>{doc.hasVolume ? `Tomo ${doc.volumeNumber}` : 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {sortedAndFilteredDocuments.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">No se encontraron documentos.</p>
        )}
      </CardContent>
    </Card>
  )
}