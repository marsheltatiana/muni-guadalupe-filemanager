import prisma from "@/lib/db";
import { createContainerSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { searchParams } = new URL(request.url);
  const estante_id = searchParams.get("estante_id");

  if (!estante_id) {
    return NextResponse.json(
      {
        message:
          "No se pudo registrar el contenedor, no se encontro el estante",
      },
      { status: 404 }
    );
  }

  const { nombre, descripcion, anio, fila, columna, tipo_contenedor_id } =
    await createContainerSchema.parseAsync(body);

  const tipoContainer = await prisma.tipo_Contenedor.findUnique({
    where: {
      id_tipo_contenedor: Number.parseInt(tipo_contenedor_id),
    },
  });

  const container = await prisma.contenedor.create({
    data: {
      nombre: nombre,
      descripcion: descripcion,
      fila: fila,
      columna: columna,
      anio: anio,
      Tipo_Contenedor: {
        connect: {
          id_tipo_contenedor: tipoContainer?.id_tipo_contenedor,
        },
      },
      Estante: {
        connect: {
          id_estante: Number.parseInt(estante_id),
        },
      },
    },
  });

  if (!container) {
    return NextResponse.json(
      {
        message: "No se puedo registrar el contenedor",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(container, {
    status: 201,
  });
}
