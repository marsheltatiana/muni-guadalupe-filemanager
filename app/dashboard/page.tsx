"use client"

import DocumentTracking from "@/components/document-tracking";
import FileManagement from "@/components/file-management";
import LoanControl from "@/components/loan-control";
import Reports from "@/components/reports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/user-management";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
          <TabsTrigger value="files">Gestión de Archivos</TabsTrigger>
          <TabsTrigger value="loans">Control de prestamos</TabsTrigger>
          <TabsTrigger value="tracking">Seguimiento de Documentos</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="files">
          <FileManagement />
        </TabsContent>
        <TabsContent value="loans">
          <LoanControl />
        </TabsContent>
        <TabsContent value="tracking">
          <DocumentTracking />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
