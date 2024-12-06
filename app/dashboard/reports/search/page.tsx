'use client'

import { useState, useEffect, useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

// Datos de ejemplo para diferentes períodos
const documentMovementsData = {
  mensual: [
    { month: 'Ene', entradas: 65, salidas: 28 },
    { month: 'Feb', entradas: 58, salidas: 48 },
    { month: 'Mar', entradas: 80, salidas: 40 },
    { month: 'Abr', entradas: 81, salidas: 19 },
    { month: 'May', entradas: 56, salidas: 96 },
    { month: 'Jun', entradas: 55, salidas: 27 },
    { month: 'Jul', entradas: 40, salidas: 100 }
  ],
  trimestral: [
    { trimestre: 'Q1', entradas: 203, salidas: 116 },
    { trimestre: 'Q2', entradas: 192, salidas: 142 },
    { trimestre: 'Q3', entradas: 150, salidas: 180 },
    { trimestre: 'Q4', entradas: 180, salidas: 160 }
  ],
  anual: [
    { year: '2020', entradas: 725, salidas: 598 },
    { year: '2021', entradas: 800, salidas: 650 },
    { year: '2022', entradas: 950, salidas: 720 },
    { year: '2023', entradas: 1100, salidas: 850 }
  ]
}

const forecastData = {
  mensual: [
    { month: 'Ago', documentos: 450 },
    { month: 'Sep', documentos: 480 },
    { month: 'Oct', documentos: 520 },
    { month: 'Nov', documentos: 570 },
    { month: 'Dic', documentos: 630 }
  ],
  trimestral: [
    { trimestre: 'Q3 2023', documentos: 1450 },
    { trimestre: 'Q4 2023', documentos: 1720 },
    { trimestre: 'Q1 2024', documentos: 1900 },
    { trimestre: 'Q2 2024', documentos: 2100 }
  ],
  anual: [
    { year: '2023', documentos: 5200 },
    { year: '2024', documentos: 6500 },
    { year: '2025', documentos: 8000 },
    { year: '2026', documentos: 9500 }
  ]
}

const searchTopics = [
  { name: 'Resoluciones de Alcaldía', value: 400 },
  { name: 'Ordenanzas Municipales', value: 300 },
  { name: 'Acuerdos de Concejo', value: 200 },
  { name: 'Decretos de Alcaldía', value: 150 },
  { name: 'Otros', value: 100 }
]

const departmentSearchesData = {
  mensual: [
    { month: 'Jul', gerencia: 45, desarrollo: 30, administracion: 25 },
    { month: 'Ago', gerencia: 50, desarrollo: 35, administracion: 28 },
    { month: 'Sep', gerencia: 40, desarrollo: 38, administracion: 32 }
  ],
  trimestral: [
    { trimestre: 'Q1', gerencia: 120, desarrollo: 90, administracion: 75 },
    { trimestre: 'Q2', gerencia: 135, desarrollo: 105, administracion: 85 },
    { trimestre: 'Q3', gerencia: 150, desarrollo: 120, administracion: 95 },
    { trimestre: 'Q4', gerencia: 165, desarrollo: 135, administracion: 105 }
  ],
  anual: [
    { year: '2020', gerencia: 480, desarrollo: 360, administracion: 300 },
    { year: '2021', gerencia: 520, desarrollo: 400, administracion: 340 },
    { year: '2022', gerencia: 580, desarrollo: 450, administracion: 380 },
    { year: '2023', gerencia: 650, desarrollo: 500, administracion: 420 }
  ]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function ReportsDashboardPage() {
  const [period, setPeriod] = useState("mensual")
  const [documentMovements, setDocumentMovements] = useState(documentMovementsData.mensual)
  const [forecast, setForecast] = useState(forecastData.mensual)
  const [departmentSearches, setDepartmentSearches] = useState(departmentSearchesData.mensual)

  const movementsChartRef = useRef(null)
  const forecastChartRef = useRef(null)
  const topicsChartRef = useRef(null)
  const departmentSearchesChartRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    setDocumentMovements(documentMovementsData[period])
    // @ts-ignore
    setForecast(forecastData[period])
    // @ts-ignore
    setDepartmentSearches(departmentSearchesData[period])
  }, [period])

  const generatePDF = async () => {
    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(18)
    doc.text(`Reporte ${period.charAt(0).toUpperCase() + period.slice(1)} de Documentos y Búsquedas`, 14, 20)
    
    // Información general
    doc.setFontSize(12)
    doc.text('Total de Documentos: 436', 14, 30)
    doc.text('Documentos Activos: 287 (65.8% del total)', 14, 40)
    
    // Movimientos de Documentos
    doc.setFontSize(14)
    doc.text('Movimientos de Documentos', 14, 55)
    // @ts-ignore
    doc.autoTable({
      head: [['Período', 'Entradas', 'Salidas']],
      // @ts-ignore
      body: documentMovements.map(item => [item.month || item.trimestre || item.year, item.entradas, item.salidas]),
      startY: 60
    })

    // Capturar y agregar gráfico de Movimientos de Documentos
    if (movementsChartRef.current) {
      const canvas = await html2canvas(movementsChartRef.current)
      const imgData = canvas.toDataURL('image/png')
      // @ts-ignore
      doc.addImage(imgData, 'PNG', 10, doc.lastAutoTable.finalY + 10, 190, 100)
    }
    
    // Pronóstico de Documentos
    doc.addPage()
    doc.setFontSize(14)
    doc.text('Pronóstico de Documentos', 14, 20)
    // @ts-ignore
    doc.autoTable({
      head: [['Período', 'Documentos Proyectados']],
      // @ts-ignore
      body: forecast.map(item => [item.month || item.trimestre || item.year, item.documentos]),
      startY: 25
    })

    // Capturar y agregar gráfico de Pronóstico de Documentos
    if (forecastChartRef.current) {
      const canvas = await html2canvas(forecastChartRef.current)
      const imgData = canvas.toDataURL('image/png')
      // @ts-ignore
      doc.addImage(imgData, 'PNG', 10, doc.lastAutoTable.finalY + 10, 190, 100)
    }
    
    // Temas Más Buscados
    doc.addPage()
    doc.setFontSize(14)
    doc.text('Temas Más Buscados', 14, 20)
    // @ts-ignore
    doc.autoTable({
      head: [['Tema', 'Cantidad de Búsquedas']],
      body: searchTopics.map(item => [item.name, item.value]),
      startY: 25
    })

    // Capturar y agregar gráfico de Temas Más Buscados
    if (topicsChartRef.current) {
      const canvas = await html2canvas(topicsChartRef.current)
      const imgData = canvas.toDataURL('image/png')
      // @ts-ignore
      doc.addImage(imgData, 'PNG', 10, doc.lastAutoTable.finalY + 10, 190, 100)
    }
    
    // Búsquedas por Área
    doc.addPage()
    doc.setFontSize(14)
    doc.text('Búsquedas por Área', 14, 20)
    // @ts-ignore
    doc.autoTable({
      head: [['Período', 'Gerencia Municipal', 'Desarrollo Urbano', 'Administración']],
      // @ts-ignore
      body: departmentSearches.map(item => [item.month || item.trimestre || item.year, item.gerencia, item.desarrollo, item.administracion]),
      startY: 25
    })

    // Capturar y agregar gráfico de Búsquedas por Área
    if (departmentSearchesChartRef.current) {
      const canvas = await html2canvas(departmentSearchesChartRef.current)
      const imgData = canvas.toDataURL('image/png')
      // @ts-ignore
      doc.addImage(imgData, 'PNG', 10, doc.lastAutoTable.finalY + 10, 190, 100)
    }
    
    // Guardar el PDF
    doc.save(`reporte_${period}_documentos_y_busquedas.pdf`)
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Reporte General</TabsTrigger>
          <TabsTrigger value="searches">Reporte de Búsquedas</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Reportes</h2>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Mensual</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Documentos
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">436</div>
                <p className="text-xs text-green-500">
                  +20.1% desde el último {period}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Documentos Activos
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">287</div>
                <p className="text-xs text-muted-foreground">
                  65.8% del total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={movementsChartRef}>
                <BarChart
                  width={800}
                  height={300}
                  data={documentMovements}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={period === 'anual' ? 'year' : (period === 'trimestral' ? 'trimestre' : 'month')} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entradas" fill="#8884d8" name="Entradas" />
                  <Bar dataKey="salidas" fill="#82ca9d" name="Salidas" />
                </BarChart>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pronóstico de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={forecastChartRef}>
                <LineChart
                  width={800}
                  height={300}
                  data={forecast}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={period === 'anual' ? 'year' : (period === 'trimestral' ? 'trimestre' : 'month')} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="documentos"
                    stroke="#8884d8"
                    name="Documentos Proyectados"
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Generar Reporte PDF
          </Button>
        </TabsContent>

        <TabsContent value="searches" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Temas Más Buscados</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={topicsChartRef}>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={searchTopics}
                      cx={200}
                      cy={150}
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {searchTopics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Búsquedas por Área</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={departmentSearchesChartRef}>
                  <LineChart
                    width={400}
                    height={300}
                    data={departmentSearches}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={period === 'anual' ? 'year' : (period === 'trimestral' ? 'trimestre' : 'month')} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gerencia" stroke="#8884d8" name="Gerencia Municipal" />
                    <Line type="monotone" dataKey="desarrollo" stroke="#82ca9d" name="Desarrollo Urbano" />
                    <Line type="monotone" dataKey="administracion" stroke="#ffc658" name="Administración" />
                  </LineChart>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Búsquedas</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                width={800}
                height={300}
                data={departmentSearches}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={period === 'anual' ? 'year' : (period === 'trimestral' ? 'trimestre' : 'month')} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gerencia" fill="#8884d8" name="Gerencia Municipal" />
                <Bar dataKey="desarrollo" fill="#82ca9d" name="Desarrollo Urbano" />
                <Bar dataKey="administracion" fill="#ffc658" name="Administración" />
              </BarChart>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Generar Reporte PDF
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}