"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SignInForm } from "./signin-form";

export function ProfileForm() {
  return (
    <Card className="w-full md:max-w-[450px]">
      <CardHeader>
        <CardTitle>Municipalidad Distrital de Guadalupe</CardTitle>
        <CardDescription>
          Inicia sesión para acceder al archivo general
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SignInForm />
      </CardContent>
      <CardFooter className="flex gap-3">
        <Link href={"#"}>
          <span className="text-sm text-primary underline-offset-4 underline">
            ¿Olvidaste tu contraseña?
          </span>
        </Link>
        <Link
          href="https://muni-guadalupe-filemanager-documentacion.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-sm text-primary underline-offset-4">
            Ayuda en linea
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}
