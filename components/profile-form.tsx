"use client";

import { signWithGoogle } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card className="w-full max-w-96">
      <CardHeader>
        <CardTitle>Municipalidad Distrital de Guadalupe</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Correo Electronico</FormLabel>
                  <FormControl>
                    <Input placeholder="nelmarie@gob.pe..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingresa tu correo electrónico institucional.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription className="text-start">
                    La contraseña debe tener al menos 10 caracteres e incluir al
                    menos un número y un caracter especial.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-3 w-full">
              <Button type="submit">Iniciar sesión</Button>
            </div>
          </form>
        </Form>
        <form action={signWithGoogle} method="post" className="mt-3">
          <Button type="submit" variant="secondary" className="w-full">
            Iniciar sesión con Google{" "}
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              fill="currentColor"
            >
              <title>Google</title>
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
          </Button>
        </form>
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
