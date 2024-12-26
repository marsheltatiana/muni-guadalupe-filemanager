'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const documentos = [
  { id: 1, nombre: "Informe Anual 2023" },
  { id: 2, nombre: "Contrato de Arrendamiento" },
  { id: 3, nombre: "Acta de Reunión 15/05/2023" },
]

type SeleccionDocumentoProps = {
  onSelect: (documentoId: number) => void
}

export function DocumentSelection({ onSelect }: SeleccionDocumentoProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? documentos.find((documento) => documento.nombre === value)?.nombre
            : "Seleccionar documento..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar documento..." />
          <CommandEmpty>No se encontraron documentos.</CommandEmpty>
          <CommandGroup>
            {documentos.map((documento) => (
              <CommandItem
                key={documento.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  onSelect(documento.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === documento.nombre ? "opacity-100" : "opacity-0"
                  )}
                />
                {documento.nombre}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

