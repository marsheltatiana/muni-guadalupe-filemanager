import prisma from "@/lib/db";
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
  const cleanName = nombre
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 6);
  const randomString = Math.random().toString(36).substring(2, 6);
  const id = `doc-${cleanName}-${timestamp}-${randomString}`;
  return id.slice(0, 20);
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

  return NextResponse.json(documents);
}
