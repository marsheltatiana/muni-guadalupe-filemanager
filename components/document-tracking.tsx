import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DocumentMovement {
  id: number;
  documentName: string;
  action: "entrada" | "salida";
  date: string;
  responsiblePerson: string;
}

export default function DocumentTracking() {
  const [movements, setMovements] = useState<DocumentMovement[]>([]);
  const [newMovement, setNewMovement] = useState<Omit<DocumentMovement, "id">>({
    documentName: "",
    action: "entrada",
    date: "",
    responsiblePerson: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMovement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: "entrada" | "salida") => {
    setNewMovement((prev) => ({ ...prev, action: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMovements((prev) => [...prev, { id: Date.now(), ...newMovement }]);
    setNewMovement({
      documentName: "",
      action: "entrada",
      date: "",
      responsiblePerson: "",
    });
  };

  return (
    <div className="w-fit">
      <h2 className="text-2xl font-semibold mb-4">Seguimiento de Documentos</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <Label htmlFor="documentName">Nombre del Documento</Label>
          <Input
            id="documentName"
            name="documentName"
            value={newMovement.documentName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="action">Acción</Label>
          <Select onValueChange={handleSelectChange} value={newMovement.action}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una acción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="salida">Salida</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={newMovement.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="responsiblePerson">Persona Responsable</Label>
          <Input
            id="responsiblePerson"
            name="responsiblePerson"
            value={newMovement.responsiblePerson}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" className="col-span-2">
          Registrar Movimiento
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Documento</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Responsable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{movement.documentName}</TableCell>
              <TableCell>{movement.action}</TableCell>
              <TableCell>{movement.date}</TableCell>
              <TableCell>{movement.responsiblePerson}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
