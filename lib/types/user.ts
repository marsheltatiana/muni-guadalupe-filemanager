export interface AuthenticatedUser {
  name: string;
  email: string;
  role: Rol;
}

interface Rol {
  name: string;
  permissions: Permission[];
}

interface Permission {
  name: string;
}
