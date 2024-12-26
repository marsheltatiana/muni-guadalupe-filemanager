import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart,
  Calendar,
  Clock,
  FileText,
  Search,
  Users,
} from "lucide-react";

export default async function Dashboard() {
  const users = await prisma.usuario.count();
  const documents = await prisma.documento.count();
  const documentsToday = await prisma.documento.count({
    where: {
      created_at: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  const totalSearches = await prisma.estadistica_busqueda.count();
  const averageSearchTime = await prisma.estadistica_busqueda.aggregate({
    _avg: {
      tiempo_segundos: true,
    },
  });
  const last5Searches = await prisma.estadistica_busqueda.findMany({
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Panel de control
        </h1>

        {/* Búsqueda y estadísticas rápidas */}
        <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documentos totales
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents}</div>
              {/* <p className="text-xs text-muted-foreground">
                +2.5% desde el último mes
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios activos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users}</div>
              {/* <p className="text-xs text-muted-foreground">
                +180 nuevos este mes
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Búsquedas realizadas
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSearches}</div>
              {/* <p className="text-xs text-muted-foreground">
                +15% desde la semana pasada
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tiempo promedio de búsqueda
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageSearchTime._avg.tiempo_segundos?.toFixed(2)}s
              </div>
              {/* <p className="text-xs text-muted-foreground">
                -0.1s desde el mes pasado
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documentos digitalizados hoy
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentsToday}</div>
              {/* <p className="text-xs text-muted-foreground">
                +23% respecto al promedio diario
              </p> */}
            </CardContent>
          </Card>
        </div>
        {/* Accesos rápidos y gráficos */}
        <div className="grid gap-6 mb-8 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Accesos rápidos</CardTitle>
              <CardDescription>
                Funciones principales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <FileText className="h-8 w-8 mb-2" />
                  Gestión de documentos
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <Users className="h-8 w-8 mb-2" />
                  Gestión de usuarios
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <Search className="h-8 w-8 mb-2" />
                  Búsqueda avanzada
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <BarChart className="h-8 w-8 mb-2" />
                  Reportes y estadísticas
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ultimas 5 consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Consulta</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {last5Searches.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.consulta}
                      </TableCell>
                      <TableCell>
                        {item.tiempo_segundos && item.tiempo_segundos
                          ? item.tiempo_segundos.toFixed(2) + "s"
                          : "No registrado"}
                      </TableCell>
                      <TableCell>
                        <span>
                          {item.created_at &&
                            formatDistanceToNow(item.created_at, {
                              addSuffix: true,
                              locale: es,
                            })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
