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
      Contenedor: true,
      Categoria_Documento: true,
    }
  });

  return NextResponse.json(documents);
}
