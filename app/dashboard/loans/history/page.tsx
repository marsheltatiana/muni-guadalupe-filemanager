import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simulación de datos de préstamos
const loans = [
  {
    id: 1,
    documentName: "Documento 1",
    personName: "Juan Pérez",
    position: "Analista",
    date: "2023-06-01",
    status: "Prestado",
  },
  {
    id: 2,
    documentName: "Documento 2",
    personName: "María García",
    position: "Gerente",
    date: "2023-05-28",
    status: "Devuelto",
  },
  {
    id: 3,
    documentName: "Documento 3",
    personName: "Carlos López",
    position: "Coordinador",
    date: "2023-06-03",
    status: "Prestado",
  },
  // Agrega más préstamos según sea necesario
];
const LoansHistoryPage = () => {
  return (
    <div className="w-fit">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>Lista de Préstamos Actuales</CardTitle>
          <CardDescription>Estado de los préstamos en curso</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full rounded-md border">
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
    </div>
  );
};

export default LoansHistoryPage;
