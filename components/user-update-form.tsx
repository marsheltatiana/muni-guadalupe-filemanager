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
import { zodResolver } from "@hookform/resolvers/zod";
import { Rol, Usuario } from "@prisma/client";
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
  password: z.string().optional(),
  role: z.string({
    required_error: "Por favor seleccione un rol.",
  }),
});

interface UserWithRol extends Usuario {
  Rol: Rol;
}

type UserUpdateFormProps = {
  user: UserWithRol;
};

export const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ user }) => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.nombre,
      email: user.email,
      password: "",
      role: user.Rol.id_rol.toString(),
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
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        toast({
          title: "Usuario actualizado ✅",
          description:
            "Por favor, notifique al usuario de la actualización de sus datos.",
        });
        router.refresh();
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Hubo un problema al actualizar el usuario.",
          variant: "destructive",
        });
      });
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Editar usuario</CardTitle>
        <CardDescription>
          Complete el formulario para editar los datos del usuario.
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
                    <Input placeholder={user.nombre} {...field} />
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
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder={user.email} {...field} />
                  </FormControl>
                  <FormDescription>
                    Correo electrónico institucional del usuario.
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
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese la nueva contraseña para el usuario.
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
                    value={user.Rol.id_rol.toString()}
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
            <Button type="submit">Actualizar Usuario</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
