"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";

export function ProfileForm() {
  const [onRegister, setOnRegister] = React.useState(false);

  return (
    <Card className="w-full md:max-w-[450px]">
      <CardHeader>
        <CardTitle>Municipalidad Distrital de Guadalupe</CardTitle>
        <CardDescription>
          {onRegister
            ? "Registrate para acceder al archivo general."
            : "Inicia sesión para acceder al archivo general."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {onRegister ? <SignUpForm /> : <SignInForm />}
        {onRegister ? (
          <Button
            onClick={() => setOnRegister(false)}
            variant="secondary"
            className="w-full"
          >
            Iniciar sesión
          </Button>
        ) : (
          <Button
            onClick={() => setOnRegister(true)}
            variant="secondary"
            className="w-full"
          >
            Registrarse
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex gap-3">
        {!onRegister && (
          <Link href={"#"}>
            <span className="text-sm text-primary underline-offset-4 underline">
              ¿Olvidaste tu contraseña?
            </span>
          </Link>
        )}
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
