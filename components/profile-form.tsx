"use client";

import Link from "next/link";
import { SignInForm } from "./signin-form";

export function ProfileForm() {
  return (
    <div className="w-full max-w-sm duration-700 fade-in motion-safe:animate-in">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
        Inicia sesión
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Usa tu correo institucional para entrar al archivo.
      </p>
      <div className="mt-8">
        <SignInForm />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
        <Link
          href={"#"}
          className="rounded-sm text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <Link
          href="https://muni-guadalupe-filemanager-documentacion.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Ayuda en línea
        </Link>
      </div>
    </div>
  );
}
