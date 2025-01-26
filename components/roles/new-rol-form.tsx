import { toast } from "@/hooks/use-toast";
import { Permisos, Rol } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

type RoleFormProps = {
  permissions: Permisos[];
};

export const NewRolForm: React.FC<RoleFormProps> = ({ permissions }) => {
  const [formData, setFormData] = useState<Rol>({
    id_rol: 0,
    nombre_rol: "",
    descripcion: "",
  });

  const router = useRouter();

  const [persmisosSeleccionados, setPersmisosSeleccionados] = useState<
    number[]
  >([]);

  const permissionsByCategory = permissions.reduce<Record<string, Permisos[]>>(
    (ac, permission: Permisos) => {
      const key: string = permission.categoria!;

      if (!ac[key]) {
        ac[key] = [];
      }

      ac[key].push(permission);

      return ac;
    },
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/roles", {
      method: "POST",
      body: JSON.stringify({
        rol: formData,
        permisos: persmisosSeleccionados,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast({
        title: "Rol Creado",
        description: "El rol se ha creado correctamente.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el rol.",
        variant: "destructive",
      });
    }

    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nombre
          </Label>
          <Input
            id="nombre_rol"
            type="text"
            value={formData.nombre_rol || ""}
            onChange={(e) =>
              setFormData({ ...formData, nombre_rol: e.target.value })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descripción
          </Label>
          <Input
            id="descripcion"
            type="text"
            value={formData.descripcion || ""}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right">Permisos</Label>
          <ScrollArea className="h-[300px] col-span-3">
            <section className="grid grid-cols-3 gap-3">
              {Object.entries(permissionsByCategory).map(
                ([permissionCategory, permissions], index) => {
                  return (
                    <section key={index} className="space-y-3">
                      <span className="font-semibold">
                        {permissionCategory?.replace(/_/g, " ").toUpperCase()}
                      </span>
                      {permissions.map((permiso) => (
                        <div
                          key={permiso.id_permiso}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <Checkbox
                            id={permiso.id_permiso.toString()}
                            onCheckedChange={(state) => {
                              if (!state) {
                                setPersmisosSeleccionados(
                                  persmisosSeleccionados.filter(
                                    (id) => id !== permiso.id_permiso
                                  )
                                );
                                return;
                              }
                              setPersmisosSeleccionados([
                                ...persmisosSeleccionados,
                                permiso.id_permiso,
                              ]);
                            }}
                          />
                          <label
                            htmlFor={`permission-${permiso.id_permiso}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permiso.nombre_permiso
                              ?.replace(/_/g, " ")
                              .toUpperCase()}
                          </label>
                        </div>
                      ))}
                    </section>
                  );
                }
              )}
            </section>
          </ScrollArea>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
};
