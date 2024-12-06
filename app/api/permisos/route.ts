import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const permisos = await prisma.permisos.findMany();

  if (permisos.length === 0) {
    return NextResponse.json(
      { message: "No hay permisos registrados." },
      { status: 404 }
    );
  }

  return NextResponse.json(permisos);
}

export async function POST(request: NextRequest) {
  const { nombre_permiso } = await request.json();

  if (!nombre_permiso) {
    return NextResponse.json(
      {
        message: "Por favor, ingrese un nombre para el permiso.",
      },
      { status: 400 }
    );
  }

  const permiso = await prisma.permisos.create({
    data: {
      nombre_permiso,
    },
  });

  return NextResponse.json(permiso, { status: 201 });
}
