import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Correo electrónico inválido para iniciar sesión"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria")
    .min(10, "La contraseña debe tener más de 10 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
});

export const signUpSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
  email: z
    .string()
    .email("Correo inválido")
    .nonempty("El correo es obligatorio"),
  password: z
    .string()
    .min(10, "Debe tener al menos 10 caracteres")
    .regex(/.*[!@#$%^&*].*/, "Debe incluir un carácter especial"),
});

export const createShelfSchema = z.object({
  nombre_estante: z.string().min(1, "El nombre del estante es requerido"),
});

export const createContainerSchema = z.object({
  nombre: z.string().min(1, "El nombre del contenedor es requerido"),
  descripcion: z.string().optional(),
  anio: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
  fila: z.string().min(1, "La fila es requerida"),
  columna: z.string().optional(),
  tipo_contenedor_id: z.string(),
});

export const createTransactionSchema = z.object({
  usuario_id: z.number(),
  documento_id: z.string(),
  tipo_transaccion: z.enum(["PRESTAMO", "DEVOLUCION"]),
  fecha_inicio: z.date(),
  fecha_fin: z.date().optional(),
});
