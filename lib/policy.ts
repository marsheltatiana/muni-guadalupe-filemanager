import { AuthenticatedUser } from "./types/user";

export enum Permission {
  // Document Management
  CREATE_DOCUMENTS = "crear_documentos",
  VIEW_DOCUMENTS = "ver_documentos",
  EDIT_DOCUMENTS = "editar_documentos",
  DELETE_DOCUMENTS = "eliminar_documentos",

  // User Management
  CREATE_USERS = "crear_usuarios",
  EDIT_USERS = "editar_usuarios",
  VIEW_USERS = "ver_usuarios",
  DELETE_USERS = "eliminar_usuarios",

  // Role Management
  CREATE_ROLES = "crear_roles",
  EDIT_ROLES = "editar_roles",
  VIEW_ROLES = "ver_roles",
  DELETE_ROLES = "eliminar_roles",

  // Shelf Management
  CREATE_SHELVES = "crear_estantes",
  EDIT_SHELVES = "editar_estantes",
  DELETE_SHELVES = "eliminar_estantes",
  VIEW_SHELVES = "ver_estantes",

  // Search Management
  SEARCH_DOCUMENTS = "buscar_documentos",

  // Transaction Management
  CREATE_TRANSACTION = "crear_transaccion",
}

export function hasAccess(
  user: AuthenticatedUser,
  permiso: Permission
): boolean {
  return user.role.permissions.some(
    (userPermiso) => userPermiso.name === permiso
  );
}
