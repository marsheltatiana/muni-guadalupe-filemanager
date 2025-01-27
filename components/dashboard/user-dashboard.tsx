import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AuthenticatedUser } from "@/lib/types/user";
import type { LucideIcon } from "lucide-react";
import { FileText, HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface DashboardCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isExternal?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  href,
  icon: Icon,
  title,
  description,
  isExternal = false,
}) => (
  <Link
    href={href}
    className="transition-all hover:scale-105 hover:shadow-lg"
    {...(isExternal ? { target: "_blank" } : {})}
  >
    <Card className="h-full bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  </Link>
);

type UserDashboardProps = {
  user: AuthenticatedUser;
};

const DOCUMENTATION_URL =
  "https://muni-guadalupe-filemanager-documentacion.vercel.app/";

const UserDashboard: React.FC<UserDashboardProps> = async ({ user }) => {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido, {user.name}
          </h1>
          <Badge variant="outline">{user.email}</Badge>
          <p className="text-md font-light tracking-wider text-gray-600/80 mt-2 mb-4 uppercase">
            Municipalidad Distrital de Guadalupe • Archivo General
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            href="/dashboard/documents"
            icon={FileText}
            title="Documentos"
            description="Accede a resoluciones, formatos y documentos oficiales"
          />
          <DashboardCard
            href="/dashboard/search"
            icon={Search}
            title="Búsqueda Avanzada"
            description="Encuentra documentos específicos de forma rápida"
          />
          <DashboardCard
            href={DOCUMENTATION_URL}
            isExternal
            icon={HelpCircle}
            title="Guía Rápida"
            description="Aprende a utilizar todas las funciones del sistema"
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
