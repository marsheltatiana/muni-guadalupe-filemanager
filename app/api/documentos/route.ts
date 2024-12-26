import prisma from "@/lib/db";
import { EstadoDocumento } from "@/lib/document-states";
import { put } from "@vercel/blob";
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

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as Blob) || null;
  const contenedor_id = Number(body.contenedor_id);
  const nombre = String(body.nombre);
  const descripcion = String(body.descripcion);
  const anio = String(body.anio);
  const categoria_id = Number(body.categoria_id);
  const file_name = String(body.file_name);

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const timestamp = new Date().getTime();

    const blob = await put(`${file_name}-${timestamp}.pdf`, buffer, {
      access: "public",
    });

    const document = await prisma.documento.create({
      data: {
        id: generateDocumentId(nombre, timestamp),
        contenedor_id,
        nombre,
        descripcion,
        anio,
        categoria_id,
        estado: EstadoDocumento.DISPONIBLE,
        documento_url: blob.url,
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
  } else {
    return NextResponse.json(
      { message: "No se pudo subir el archivo." },
      { status: 400 }
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
