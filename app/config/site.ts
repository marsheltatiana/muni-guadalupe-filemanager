import { SiteItem } from "@/lib/types/site-item";
import {
  Archive,
  History,
  SearchSlash,
  Sheet,
  Touchpad,
  User2,
} from "lucide-react";

export const Maintainers: SiteItem[] = [
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

export const Search: SiteItem[] = [
  {
    title: "Busqueda",
    url: "/dashboard/search",
    icon: SearchSlash,
  },
];

export const Transactions: SiteItem[] = [
  {
    title: "Transacciones",
    url: "/dashboard/transactions",
    icon: History,
  },
];
