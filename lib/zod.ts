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
