import Reports from "@/components/reports";
import { SupportChat } from "@/components/support-chat";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Calendar,
  Clock,
  FileText,
  Search,
  Users,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Panel de control
        </h1>

        {/* Búsqueda y estadísticas rápidas */}
        <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Búsqueda rápida de documentos</CardTitle>
              <CardDescription>
                Busca por título, contenido o metadatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Ingresa términos de búsqueda..."
                  className="flex-grow"
                />
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documentos totales
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-xs text-muted-foreground">
                +2.5% desde el último mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas detalladas */}
        <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios activos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,274</div>
              <p className="text-xs text-muted-foreground">
                +180 nuevos este mes
              </p>
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
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-muted-foreground">
                +15% desde la semana pasada
              </p>
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
              <div className="text-2xl font-bold">1.2s</div>
              <p className="text-xs text-muted-foreground">
                -0.1s desde el mes pasado
              </p>
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
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">
                +23% respecto al promedio diario
              </p>
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
              <CardTitle>Estadísticas de uso</CardTitle>
              <CardDescription>
                Actividad del sistema en los últimos 30 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Reports />
            </CardContent>
          </Card>
        </div>

        {/* Actividad reciente y documentos populares */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <Tabs defaultValue="actividad" className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Actividad del sistema</CardTitle>
                  <TabsList>
                    <TabsTrigger value="actividad">Actividad</TabsTrigger>
                    <TabsTrigger value="alertas">Alertas</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="actividad">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Acción</TableHead>
                        <TableHead>Hora</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          user: "María L.",
                          action: "Subió 5 documentos",
                          time: "Hace 5 min",
                        },
                        {
                          user: "Juan P.",
                          action: "Actualizó metadatos",
                          time: "Hace 15 min",
                        },
                        {
                          user: "Ana S.",
                          action: "Realizó búsqueda avanzada",
                          time: "Hace 30 min",
                        },
                        {
                          user: "Carlos R.",
                          action: "Generó reporte mensual",
                          time: "Hace 1 hora",
                        },
                        {
                          user: "Laura M.",
                          action: "Modificó permisos de acceso",
                          time: "Hace 2 horas",
                        },
                      ].map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.user}
                          </TableCell>
                          <TableCell>{item.action}</TableCell>
                          <TableCell>{item.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="alertas">
                  <ul className="space-y-4">
                    <li className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="font-semibold">Mantenimiento programado</p>
                      <p className="text-sm">
                        El sistema estará en mantenimiento mañana de 2:00 AM a
                        4:00 AM.
                      </p>
                    </li>
                    <li className="bg-red-50 border-l-4 border-red-400 p-4">
                      <p className="font-semibold">Alerta de seguridad</p>
                      <p className="text-sm">
                        Se detectaron intentos de acceso no autorizado. Por
                        favor, verifique sus credenciales.
                      </p>
                    </li>
                  </ul>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Documentos más consultados</CardTitle>
              <CardDescription>En los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Consultas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      doc: "Ordenanza Municipal 2023-001",
                      category: "Legal",
                      views: 342,
                    },
                    {
                      doc: "Plano Catastral Zona Norte",
                      category: "Urbanismo",
                      views: 289,
                    },
                    {
                      doc: "Presupuesto Anual 2024",
                      category: "Finanzas",
                      views: 256,
                    },
                    {
                      doc: "Acta de Sesión Ordinaria 15/10",
                      category: "Administrativo",
                      views: 198,
                    },
                    {
                      doc: "Proyecto de Ley Local #45",
                      category: "Legal",
                      views: 175,
                    },
                  ].map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.doc}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.views}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <SupportChat />
        </div>
      </div>
    </div>
  );
}
