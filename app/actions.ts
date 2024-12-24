"use server";

import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function signWithGoogle() {
  await signIn("google");
}

export async function signInWithCredentials(formData: FormData) {
  await signIn("credentials", formData);
}

export async function signUpWithCredentials(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashPwd = await bcrypt.hash(password, 14);

  const user = await prisma.usuario.create({
    data: {
      nombre: name,
      email,
      contrasenia: hashPwd,
    },
  });

  if (!user) {
    throw new Error("Error al crear el usuario");
  }

  return user;
}
