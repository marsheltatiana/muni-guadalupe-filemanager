# 📂 Administrador de Archivos para la Municipalidad Distrital de Guadalupe 
### https://munifilemanager.vercel.app/

Este proyecto es una aplicación web creada con **Next.js** que permite la administración y gestión de archivos para la Municipalidad Distrital de Guadalupe. El sistema facilita el almacenamiento, organización y visualización de documentos de manera eficiente.

## 🚀 Características

- **📁 Gestión de archivos:** Subida, descarga y eliminación de documentos.
- **🔍 Búsqueda avanzada:** Filtrado de archivos por nombre, tipo o fecha.
- **📊 Informes:** Generación de reportes detallados sobre el uso del sistema.
- **🔒 Seguridad:** Protección mediante autenticación de usuarios.
- **💼 Gestión de usuarios:** Administración de roles y permisos.
- **📱 Multiplataforma:** Funciona en dispositivos móviles y de escritorio.

## 🛠️ Tecnologías Utilizadas

- **Next.js**: Framework de React para la creación de aplicaciones web.
- **React**: Biblioteca para construir interfaces de usuario.
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **PostgreSQL**: Base de datos para almacenar los archivos.
- **Tailwind CSS & Shadcn/UI** (opcional): Para el diseño responsivo y moderno.

## 🗂️ Componentes

El proyecto cuenta con los siguientes componentes dentro de la carpeta `components/ui`:

- **📄 Document Tracking (`document-tracking.tsx`):** Seguimiento de los documentos subidos y gestionados en el sistema.
- **📁 File Management (`file-management.tsx`):** Gestión de archivos, incluyendo la subida, descarga y eliminación.
- **📊 Reports (`reports.tsx`):** Generación de informes sobre los documentos y actividad del sistema.
- **🔐 Sign In (`sign-in.tsx`):** Componente para la autenticación de usuarios.
- **👥 User Management (`user-management.tsx`):** Gestión de usuarios, roles y permisos.

## 🚀 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/marsheltatiana/muni-guadalupe-filemanager
   ```

2. Instalar dependencias
   ```bash
    cd muni-guadalupe-filemanager
    npm install
   ```

## ⚙️ Configuración

3. Crear el archivo .env.local
   ```bash
    cp .env.example .env.local
   ```
4. Establecer las variables de entorno
> Crear una App en Google Cloud y optener las credenciales para la API de oAuth2
   ```bash
   AUTH_GOOGLE_ID=<tu id>
   AUTH_GOOGLE_SECRET=<tu secreto>
   ```
## 🚀 Despliege en local
5. Ejecutar el servidor de desarrollo
   ```bash
    npm run dev
   ```
6. Accede a la aplicacion en tu navegador.
   ```
    http://localhost:3000
   ```
