"use client";

import { signUpWithCredentials } from "@/app/actions";
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
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function onSubmitSignUp(values: z.infer<typeof signUpSchema>) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("email", values.email);
  formData.append("password", values.password);

  signUpWithCredentials(formData)
    .then((user) => {
      toast({
        title: `${user.nombre} te has registrado correctamente. 🎉`,
        description: `Ahora puedes iniciar sesión. 😊`,
      });
    })
    .catch((error) => {
      toast({
        title: `Error al registrarse. 😢`,
        description: `${error.message}`,
        variant: "destructive",
      });
    });
}

export const SignUpForm = () => {
  const formSignUp = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });
  return (
    <Form {...formSignUp}>
      <form
        onSubmit={formSignUp.handleSubmit(onSubmitSignUp)}
        className="space-y-8"
      >
        <FormField
          control={formSignUp.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Nombres completos</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nelmarie Marshel Tatiana..."
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
          control={formSignUp.control}
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
          control={formSignUp.control}
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
          Registrarme
        </Button>
      </form>
    </Form>
  );
};
