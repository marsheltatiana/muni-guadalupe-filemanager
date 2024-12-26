"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Rol, Usuario } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface UserWithRol extends Usuario {
  Rol: Rol;
}

type SeleccionUsuarioProps = {
  usuarios: UserWithRol[];
  onSelect: (userId: number) => void;
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function UserSelection({ usuarios, onSelect }: SeleccionUsuarioProps) {
  return (
    <Select onValueChange={(value) => onSelect(Number(value))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar usuario..." />
      </SelectTrigger>
      <SelectContent>
        {usuarios.map((usuario) => (
          <SelectItem key={usuario.id_usuario} value={usuario.id_usuario.toString()}>
            {usuario.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
