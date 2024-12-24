"use client";

import { signInWithCredentials } from "@/app/actions";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/hooks/use-toast";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function onSubmitSignIn(values: z.infer<typeof signInSchema>) {
  const formData = new FormData();
  formData.append("email", values.email);
  formData.append("password", values.password);

  signInWithCredentials(formData)
    .then(() => {
      toast({
        title: `Bienvenido. 🎉`,
        description: `Has iniciado sesión correctamente.`,
      });
    })
    .catch((error) => {
      toast({
        title: `Error al iniciar sesión. 😢`,
        description: `${error.message}`,
        variant: "destructive",
      });
    });
}

export const SignInForm = () => {
  const formSignIn = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  return (
    <Form {...formSignIn}>
      <form
        onSubmit={formSignIn.handleSubmit(onSubmitSignIn)}
        className="space-y-8"
      >
        <FormField
          control={formSignIn.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Correo Electronico</FormLabel>
              <FormControl>
                <Input
                  placeholder="nelmarie@gob.pe..."
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ingresa tu correo electrónico institucional.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formSignIn.control}
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
        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </form>
    </Form>
  );
};
