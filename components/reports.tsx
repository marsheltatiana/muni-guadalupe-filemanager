"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const mockData = [
  { month: 'Ene', entradas: 65, salidas: 28 },
  { month: 'Feb', entradas: 59, salidas: 48 },
  { month: 'Mar', entradas: 80, salidas: 40 },
  { month: 'Abr', entradas: 81, salidas: 19 },
  { month: 'May', entradas: 56, salidas: 96 },
  { month: 'Jun', entradas: 55, salidas: 27 },
  { month: 'Jul', entradas: 40, salidas: 100 }
]

export default function Reports() {
  const [reportType, setReportType] = useState('monthly')

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reportes</h2>
      <div className="mb-4">
        <Select onValueChange={setReportType} value={reportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Reporte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">436</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el último periodo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documentos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">287</div>
            <p className="text-xs text-muted-foreground">65.8% del total</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Movimientos de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entradas" fill="#8884d8" />
              <Bar dataKey="salidas" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button>Generar Reporte PDF</Button>
      </div>
    </div>
  )
}