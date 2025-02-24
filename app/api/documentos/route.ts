import prisma from "@/lib/db";
import { EstadoDocumento } from "@/lib/document-states";
import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

type DocumentRequest = {
  contenedor_id: number;
  nombre: string;
  descripcion: string;
  anio: string;
  categoria_id: number;
  file_name: string;
  file: File;
};

function generateDocumentId(nombre: string, timestamp: number): string {
  // Prefijo de la empresa (3 caracteres)
  const prefix = "MDG";

  // Tomar las primeras palabras del nombre, convertir a minúsculas y limpiar (7 caracteres)
  let cleanName = nombre
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .slice(0, 2)
    .join("-");
  cleanName = cleanName.slice(0, 7);

  // Formatear fecha como YYYYMMDDHHM (11 caracteres)
  const date = new Date(timestamp);
  const dateStr = date
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 11);

  // Generar caracteres aleatorios (6 caracteres)
  const randomStr = Math.random().toString(36).substring(2, 8);

  // Combinar todo en formato: MDG-nombre-fecha-random (exactamente 30 caracteres)
  return `${prefix}-${cleanName}-${dateStr}-${randomStr}`;
}

// https://vercel.com/docs/storage/vercel-blob/client-upload
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const contenedor_id = Number(body.contenedor_id);
  const nombre = String(body.nombre);
  const descripcion = String(body.descripcion);
  const anio = String(body.anio);
  const categoria_id = Number(body.categoria_id);
  const blob_url = String(body.blob_url ?? "");

  const timestamp = new Date().getTime();

  try {
    const document = await prisma.documento.create({
      data: {
        id: generateDocumentId(nombre, timestamp),
        contenedor_id,
        nombre,
        descripcion,
        anio,
        categoria_id,
        estado: EstadoDocumento.DISPONIBLE,
        documento_url: blob_url,
      },
    });

    if (document) {
      return NextResponse.json(
        { message: "Documento creado exitosamente." },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Error al crear el documento." },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error al subir el documento.", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const documents = await prisma.documento.findMany({
      include: {
        Contenedor: {
          include: {
            Tipo_Contenedor: {
              select: {
                nombre: true,
              },
            },
            Estante: {
              select: {
                nombre_estante: true,
              },
            },
          },
        },
        Categoria_Documento: {
          select: {
            nombre_categoria: true,
          },
        },
      },
      orderBy:{
        created_at: 'desc'
      }
    });

    if (!documents) {
      return NextResponse.json(
        { message: "No se encontraron documentos." },
        { status: 404 }
      );
    }

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener los documentos.", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Obtener el ID del documento desde los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Se requiere un ID de documento para eliminar." },
        { status: 400 }
      );
    }

    // Verificar si el documento existe antes de eliminar
    const documentExists = await prisma.documento.findUnique({
      where: { id },
    });

    if (!documentExists) {
      return NextResponse.json(
        { message: "Documento no encontrado." },
        { status: 404 }
      );
    }

    // Eliminar el documento
    await prisma.documento.delete({
      where: { id },
    });

    if (documentExists.documento_url) {
      await del(documentExists.documento_url!);
    }

    return NextResponse.json(
      { message: "Documento eliminado exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al eliminar el documento.", error },
      { status: 500 }
    );
  }
}
