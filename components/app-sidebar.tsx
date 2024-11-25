import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import {
  Archive,
  ChevronUp,
  FolderArchive,
  History,
  Printer,
  SearchSlash,
  Sheet,
  Touchpad,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOut } from "./sign-out";

const mantenedoresItems = [
  {
    title: "Gestion de Usuarios",
    url: "/dashboard/users",
    icon: User2,
  },
  {
    title: "Gestion de Roles y permisos",
    url: "/dashboard/roles",
    icon: Sheet,
  },
  {
    title: "Gestión de documentos",
    url: "/dashboard/documents",
    icon: Touchpad,
  },
  {
    title: "Gestion de Estantes",
    url: "/dashboard/shelf",
    icon: Archive,
  },
];

const busquedaItems = [
  {
    title: "Busqueda semantica",
    url: "/dashboard/search",
    icon: SearchSlash,
  },
];

const prestamosItems = [
  {
    title: "Registro",
    url: "/dashboard/loans",
    icon: FolderArchive,
  },
  {
    title: "Historial",
    url: "/dashboard/loans/history",
    icon: History,
  },
];

const reportesItems = [
  {
    title: "Reporte de busquedas",
    url: "/dashboard/reports/search",
    icon: Printer,
  },
];

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session?.user;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link className="text-xl font-bold text-primary" href="/dashboard">
          Archivo General
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mantenedores</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mantenedoresItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Busqueda</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {busquedaItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Prestamos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {prestamosItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Reportes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportesItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Image
                    src={user.image!}
                    width={24}
                    height={24}
                    alt="avatar"
                    className="rounded-full hover:scale-90 transition-transform duration-150 ease-in-out transform-gpu"
                  />
                  {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <section className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Archivo General
        </section>
      </SidebarFooter>
    </Sidebar>
  );
}
