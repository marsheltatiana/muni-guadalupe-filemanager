'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'

export default function CrearPermiso() {
  const [nombrePermiso, setNombrePermiso] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombrePermiso.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un nombre para el permiso.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    // Aquí iría la lógica para guardar el permiso
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulando una operación asíncrona
    toast({
      title: "Éxito",
      description: "El permiso ha sido creado correctamente.",
    })
    setNombrePermiso('')
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle>Crear Nuevo Permiso</CardTitle>
        <CardDescription>Ingrese el nombre del nuevo permiso que desea crear.</CardDescription>
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
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Permiso'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}