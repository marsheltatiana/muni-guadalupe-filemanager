import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface File {
  id: number
  name: string
  year: number
  volume: number
  shelf: number
  row: number
}

export default function FileManagement() {
  const [files, setFiles] = useState<File[]>([])
  const [newFile, setNewFile] = useState<Omit<File, 'id'>>({
    name: '',
    year: new Date().getFullYear(),
    volume: 1,
    shelf: 1,
    row: 1,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewFile(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFiles(prev => [...prev, { id: Date.now(), ...newFile }])
    setNewFile({
      name: '',
      year: new Date().getFullYear(),
      volume: 1,
      shelf: 1,
      row: 1,
    })
  }

  return (
    <div className='w-fit'>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Archivos</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-8">
        <div className="col-span-3">
          <Label htmlFor="name">Nombre del Documento</Label>
          <Input
            id="name"
            name="name"
            value={newFile.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="year">Año</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={newFile.year}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="volume">Tomo</Label>
          <Input
            id="volume"
            name="volume"
            type="number"
            value={newFile.volume}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="shelf">Estante (1-3)</Label>
          <Input
            id="shelf"
            name="shelf"
            type="number"
            min="1"
            max="3"
            value={newFile.shelf}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="row">Fila (1-6)</Label>
          <Input
            id="row"
            name="row"
            type="number"
            min="1"
            max="6"
            value={newFile.row}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" className="col-span-3">Guardar Archivo</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Tomo</TableHead>
            <TableHead>Estante</TableHead>
            <TableHead>Fila</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.year}</TableCell>
              <TableCell>{file.volume}</TableCell>
              <TableCell>{file.shelf}</TableCell>
              <TableCell>{file.row}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Editar</Button>
                <Button variant="destructive" size="sm">Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}