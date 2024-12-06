import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const estantes = await prisma.estante.findMany({
    include: {
      Contenedor: true,
    },
  });

  if (estantes.length === 0) {
    return NextResponse.json(
      {
        message: "No se encontraron estantes",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(estantes);
}

// crear estante

export async function POST(request: NextRequest) {
  const { nombre_estante } = await request.json();

  const estante = await prisma.estante.create({
    data: {
      nombre_estante,
    },
  });

  if (!estante) {
    return NextResponse.json(
      {
        message: "No se pudo crear el estante",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(estante, { status: 201 });
}
