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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createTransactionSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rol, Usuario } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { EstadoDocumento } from "@/lib/document-states";

const formSchema = createTransactionSchema;

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
  const router = useRouter();

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
      const response = await fetch("/api/transacciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        toast({
          title: "❌ Error al registrar transacción",
          description: "Ha ocurrido un error al registrar la transacción",
          variant: "destructive",
        });
      } else {
        toast({
          title: "✅ Transacción registrada",
          description: "La transacción ha sido registrada exitosamente",
        });

        if (values.tipo_transaccion === "PRESTAMO") {
            await fetch(`/api/documentos/estados?id=${
            values.documento_id 
          }`, {
            method: 'POST',
            body: JSON.stringify({
              estado: EstadoDocumento.PRESTADO
            })
          })
        } else {
          await fetch(`/api/documentos/estados?id=${
            values.documento_id 
          }`, {
            method: 'POST',
            body: JSON.stringify({
              estado: EstadoDocumento.DISPONIBLE
            })
          })
        }
        

        router.refresh();
      }

      form.reset();
    } catch (error) {
      console.error("Error al crear la transacción:", error);
      toast({
        title: "❌ Error al registrar transacción",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const [isDevolucion, setIsDevolucion] = useState(false);
  useEffect(() => {
    const tipoTransaccion = form.watch("tipo_transaccion");
    setIsDevolucion(tipoTransaccion === "DEVOLUCION");
  }, [form.watch("tipo_transaccion")]);

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
                  <FormLabel>
                    {isDevolucion ? "Fecha" : "Fecha de Inicio"}
                  </FormLabel>
                  <DatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isDevolucion && (
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
            )}
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
