import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const permisos = await prisma.permisos.findMany({
      orderBy: {
        id_permiso: "desc",
      },
    });

    if (permisos.length === 0) {
      return NextResponse.json(
        { message: "No hay permisos registrados." },
        { status: 404 }
      );
    }

    return NextResponse.json(permisos);
  } catch (error: any | unknown) {
    return NextResponse.json(
      { message: `Error al optener los permisos ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { nombre_permiso }: { nombre_permiso: string } = await request.json();

  if (!nombre_permiso) {
    return NextResponse.json(
      {
        message: "Por favor, ingrese un nombre para el permiso.",
      },
      { status: 400 }
    );
  }

  const nombrePermiso = nombre_permiso
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const permiso = await prisma.permisos.create({
    data: {
      nombre_permiso: nombrePermiso,
    },
  });

  return NextResponse.json(permiso, { status: 201 });
}
