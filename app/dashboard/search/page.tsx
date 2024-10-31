"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Calendar, FileText, User, Tag, Clock, ChevronRight, ChevronLeft } from 'lucide-react'

type SearchResult = {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  relevance: number
  tags: string[]
  pdfUrl: string
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Ordenanza Municipal 2023-001: Regulación de Espacios Públicos',
    excerpt: 'Esta ordenanza establece las normas para el uso y mantenimiento de parques y plazas en el municipio...',
    category: 'Legal',
    author: 'Consejo Municipal',
    date: '2023-03-15',
    relevance: 0.95,
    tags: ['ordenanza', 'espacios públicos', 'parques'],
    pdfUrl: '/placeholder.pdf'
  },
  {
    id: '2',
    title: 'Informe Anual de Gestión Ambiental 2022',
    excerpt: 'Resumen de las iniciativas ambientales implementadas durante el año 2022, incluyendo programas de reciclaje y conservación...',
    category: 'Medio Ambiente',
    author: 'Departamento de Medio Ambiente',
    date: '2023-02-01',
    relevance: 0.88,
    tags: ['informe', 'medio ambiente', 'reciclaje'],
    pdfUrl: '/placeholder.pdf'
  },
  {
    id: '3',
    title: 'Plan de Desarrollo Urbano 2023-2030',
    excerpt: 'Documento que detalla la visión y estrategias para el crecimiento y mejora de la infraestructura urbana en los próximos 7 años...',
    category: 'Urbanismo',
    author: 'Oficina de Planificación',
    date: '2023-01-10',
    relevance: 0.92,
    tags: ['desarrollo urbano', 'planificación', 'infraestructura'],
    pdfUrl: '/placeholder.pdf'
  },
]

export default function SemanticSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [relevanceThreshold, setRelevanceThreshold] = useState([0.7])
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsSearching(true)
    // Simulamos una búsqueda con IA
    setTimeout(() => {
      setResults(mockResults.filter(result => result.relevance >= relevanceThreshold[0]))
      setIsLoading(false)
      setIsSearching(false)
    }, 2000)
  }

  useEffect(() => {
    if (isSearching) {
      const interval = setInterval(() => {
        setSelectedPdf(mockResults[Math.floor(Math.random() * mockResults.length)].pdfUrl)
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isSearching])

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Búsqueda Semántica con IA</h1>
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Ingresa tu consulta semántica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-6 text-lg"
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex gap-6">
        {/* Columna izquierda: Filtros y Resultados */}
        <div className="w-1/2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros Avanzados</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="filters" className="w-full">
                <TabsList>
                  <TabsTrigger value="filters">Filtros</TabsTrigger>
                  <TabsTrigger value="settings">Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="filters" className="space-y-4">
                  <div className="flex space-x-4">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="ambiental">Ambiental</SelectItem>
                        <SelectItem value="urbanismo">Urbanismo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-week">Última semana</SelectItem>
                        <SelectItem value="last-month">Último mes</SelectItem>
                        <SelectItem value="last-year">Último año</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="relevance-threshold" className="text-sm font-medium">
                      Umbral de Relevancia: {relevanceThreshold[0].toFixed(2)}
                    </label>
                    <Slider
                      id="relevance-threshold"
                      min={0}
                      max={1}
                      step={0.01}
                      value={relevanceThreshold}
                      onValueChange={setRelevanceThreshold}
                      className="w-[200px]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="ai-analysis" />
                    <label htmlFor="ai-analysis" className="text-sm font-medium">
                      Análisis Profundo con IA
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados de la Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                {results.map((result, index) => (
                  <React.Fragment key={result.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{result.title}</h3>
                      <p className="text-sm text-gray-600">{result.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FileText className="mr-1 h-4 w-4" />
                          {result.category}
                        </span>
                        <span className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {result.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {result.date}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Relevancia: {(result.relevance * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {result.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setSelectedPdf(result.pdfUrl)}
                      >
                        Ver PDF
                      </Button>
                    </div>
                  </React.Fragment>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: Visualización de PDF */}
        <div className="w-1/2">
          <Card className="h-[calc(100vh-120px)]">
            <CardHeader>
              <CardTitle>Visualización de Documentos</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {isSearching ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
                    <p>Analizando documentos con IA...</p>
                  </div>
                </div>
              ) : selectedPdf ? (
                <iframe 
                  src={selectedPdf} 
                  className="w-full h-full" 
                  title="PDF Viewer"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Selecciona un documento para visualizar
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}