import { Permission } from "@/lib/policy";
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
    viewPolicy: Permission.VIEW_USERS,
  },
  {
    title: "Gestion de Roles y permisos",
    url: "/dashboard/roles",
    icon: Sheet,
    viewPolicy: Permission.VIEW_ROLES,
  },
  {
    title: "Gestión de documentos",
    url: "/dashboard/documents",
    icon: Touchpad,
    viewPolicy: Permission.VIEW_DOCUMENTS,
  },
  {
    title: "Gestion de Estantes",
    url: "/dashboard/shelf",
    icon: Archive,
    viewPolicy: Permission.VIEW_SHELVES,
  },
];

export const Search: SiteItem[] = [
  {
    title: "Busqueda",
    url: "/dashboard/search",
    icon: SearchSlash,
    viewPolicy: Permission.SEARCH_DOCUMENTS,
  },
];

export const Transactions: SiteItem[] = [
  {
    title: "Transacciones",
    url: "/dashboard/transactions",
    icon: History,
    viewPolicy: Permission.CREATE_TRANSACTION,
  },
];
