"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rol, Usuario } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { UserSelection } from "./user-selection";

const formSchema = z.object({
  usuario_id: z.number(),
  documento_id: z.string(),
  tipo_transaccion: z.enum(["PRESTAMO", "DEVOLUCION"]),
  fecha_inicio: z.date(),
  fecha_fin: z.date().optional(),
});

interface UserWithRol extends Usuario {
  Rol: Rol;
}

type FormularioTransaccionProps = {
  className?: string;
  usuarios: UserWithRol[];
};

export function TransactionForm({
  className,
  usuarios,
}: FormularioTransaccionProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_transaccion: "PRESTAMO",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      console.log(values);

      form.reset();
    } catch (error) {
      console.error("Error al crear la transacción:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={cn("w-full max-w-lg mb-3", className)}>
      <CardHeader>
        <CardTitle>Registro nueva transacción</CardTitle>
        <CardDescription>
          Ingrese los detalles de la transacción. Complete todos los campos
          requeridos para registrar un nuevo préstamo o devolución de
          documentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="usuario_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <UserSelection
                      usuarios={usuarios}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documento_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ID del documento" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo_transaccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Transacción</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de transacción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRESTAMO">Préstamo</SelectItem>
                      <SelectItem value="DEVOLUCION">Devolución</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fecha_inicio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <DatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fecha_fin"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Fin (opcional)</FormLabel>
                  <DatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Transacción"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
