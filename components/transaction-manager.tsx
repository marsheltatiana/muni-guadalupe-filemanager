'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Transaccion } from '@prisma/client'
import { TransactionForm } from './transaction-form'
import { TransactionsTable } from './transactions-table'

export function TransactionsManager() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])

  const agregarTransaccion = (nuevaTransaccion: Transaccion) => {
    setTransacciones([nuevaTransaccion, ...transacciones])
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Gestión de Préstamos y Devoluciones</CardTitle>
        <CardDescription>Registra y visualiza las transacciones de documentos</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formulario" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="formulario">Registrar Transacción</TabsTrigger>
            <TabsTrigger value="historial">Historial de Transacciones</TabsTrigger>
          </TabsList>
          <TabsContent value="formulario">
            <TransactionForm onTransaccionCreada={agregarTransaccion} />
          </TabsContent>
          <TabsContent value="historial">
            <TransactionsTable transacciones={transacciones} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

