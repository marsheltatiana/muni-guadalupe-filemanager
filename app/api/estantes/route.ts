import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const estantes = await prisma.estante.findMany({
      include: {
        Contenedor: true,
      },
    });

    if (!estantes) {
      return NextResponse.json(
        {
          message: "No se encontraron estantes",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(estantes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al obtener los estantes",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

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
