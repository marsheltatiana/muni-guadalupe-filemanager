"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Search, Trash2, UserPlus } from 'lucide-react'

// Tipos de datos
type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'admin' },
    { id: '2', name: 'María García', email: 'maria@ejemplo.com', role: 'editor' },
    { id: '3', name: 'Carlos López', email: 'carlos@ejemplo.com', role: 'user' },
  ])
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user'
  })
  
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: Date.now().toString() }])
      setNewUser({ name: '', email: '', role: 'user' })
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container p-6 w-fit">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Búsqueda */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Formulario de nuevo usuario */}
          <form onSubmit={handleAddUser} className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Nombre"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <Input
                placeholder="Correo Electrónico"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="md:col-span-2"
              />
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Agregar Usuario
            </Button>
          </form>

          {/* Tabla de usuarios */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.role === 'editor' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {user.role === 'admin' ? 'Administrador' : 
                         user.role === 'editor' ? 'Editor' : 'Usuario'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}