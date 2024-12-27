import { Suspense } from 'react';
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
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart, Calendar, Clock, FileText, Search, Users, ArrowRight, TrendingUp, TrendingDown, TypeIcon as type, LucideIcon } from 'lucide-react';
import Link from "next/link";

interface Stats {
  users: number;
  documents: number;
  documentsToday: number;
  totalSearches: number;
  averageSearchTime: {
    _avg: {
      tiempo_segundos: number | null;
    };
  };
  last5Searches: Array<{
    id: number;
    consulta: string | null;
    tiempo_segundos: number | null;
    created_at: Date | null;
  }>;
}

async function getStats(): Promise<Stats> {
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

  return {
    users,
    documents,
    documentsToday,
    totalSearches,
    averageSearchTime,
    last5Searches,
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  trendValue: number;
}

function StatCard({ title, value, icon: Icon, trend, trendValue }: StatCardProps) {
  const isPositive = trendValue > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50 p-4">
        <CardTitle className="text-sm font-medium flex items-center">
          <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-3xl font-bold mb-2">{value}</div>
        {trend && (
          <p className={`text-sm flex items-center ${trendColor}`}>
            <TrendIcon className="h-4 w-4 mr-1" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickAccessButtonProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

function QuickAccessButton({ href, icon: Icon, children }: QuickAccessButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        className="h-24 w-full flex flex-col items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Icon className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium">{children}</span>
      </Button>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[160px]" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-primary">Panel de Control</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getStats();

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard
          title="Documentos totales"
          value={stats.documents.toLocaleString()}
          icon={FileText}
          trend="+2.5% desde el último mes"
          trendValue={2.5}
        />
        <StatCard
          title="Usuarios activos"
          value={stats.users.toLocaleString()}
          icon={Users}
          trend="+180 nuevos este mes"
          trendValue={180}
        />
        <StatCard
          title="Búsquedas realizadas"
          value={stats.totalSearches.toLocaleString()}
          icon={Search}
          trend="+15% desde la semana pasada"
          trendValue={15}
        />
        <StatCard
          title="Tiempo promedio de búsqueda"
          value={`${stats.averageSearchTime._avg.tiempo_segundos?.toFixed(2)}s`}
          icon={Clock}
          trend="-0.1s desde el mes pasado"
          trendValue={-0.1}
        />
        <StatCard
          title="Documentos digitalizados hoy"
          value={stats.documentsToday.toLocaleString()}
          icon={Calendar}
          trend="+23% respecto al promedio diario"
          trendValue={23}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Accesos rápidos
            </CardTitle>
            <CardDescription>Funciones principales del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <QuickAccessButton href="/dashboard/documents" icon={FileText}>
                Gestión de documentos
              </QuickAccessButton>
              <QuickAccessButton href="/dashboard/users" icon={Users}>
                Gestión de usuarios
              </QuickAccessButton>
              <QuickAccessButton href="/dashboard/search" icon={Search}>
                Super búsqueda
              </QuickAccessButton>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Últimas 5 consultas
            </CardTitle>
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
                {stats.last5Searches.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.consulta || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {item.tiempo_segundos
                        ? item.tiempo_segundos.toFixed(2) + "s"
                        : "No registrado"}
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {item.created_at
                          ? formatDistanceToNow(item.created_at, {
                              addSuffix: true,
                              locale: es,
                            })
                          : 'Fecha no disponible'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

