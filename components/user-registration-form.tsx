"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rol } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Debe ser un correo electrónico válido.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  role: z.string({
    required_error: "Por favor seleccione un rol.",
  }),
});

interface UserRegistrationFormProps {
  className?: string;
}

export const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  className,
}) => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  useEffect(() => {
    async function fetchRoles() {
      const fetchedRoles = await fetch("/api/roles").then((res) => res.json());
      setRoles(fetchedRoles);
    }
    fetchRoles();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        toast({
          title: "Usuario registrado",
          description:
            "Por favor, notifique al usuario de su contraseña temporal.",
        });
        router.refresh();
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Hubo un problema al registrar el usuario.",
          variant: "destructive",
        });
      });
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Registro de Usuario</CardTitle>
        <CardDescription>
          Complete el formulario para registrar un nuevo usuario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres completos</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nelmarie Marshel Tatiana..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese el nombre completo del usuario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="nsanchezv@gob.pe..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese el correo electrónico institucional del usuario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña temporal</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese una contraseña temporal para el usuario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem
                          key={role.id_rol}
                          value={role.id_rol.toString()}
                        >
                          {role.nombre_rol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Seleccione el rol del usuario en el sistema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Registrar Usuario</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
