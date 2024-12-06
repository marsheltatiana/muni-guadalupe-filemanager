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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CrearPermiso() {
  const [nombrePermiso, setNombrePermiso] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombrePermiso.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un nombre para el permiso.",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("/api/permisos", {
      method: "POST",
      body: JSON.stringify({ nombre_permiso: nombrePermiso }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast({
        title: "Permiso Creado",
        description: "El permiso se ha creado correctamente.",
        variant: "default",
      });
      setNombrePermiso("");
    } else {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el permiso.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle>Crear Nuevo Permiso</CardTitle>
        <CardDescription>
          Ingrese el nombre del nuevo permiso que desea crear.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nombrePermiso">Nombre del Permiso</Label>
              <Input
                id="nombrePermiso"
                placeholder="Ingrese el nombre del permiso"
                value={nombrePermiso}
                onChange={(e) => setNombrePermiso(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Guardar Permiso
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
