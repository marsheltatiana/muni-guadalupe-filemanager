import prisma from "@/lib/db";
import { Rol } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const roles = await prisma.rol.findMany({
    include: {
      Rol_Permisos: {
        select: {
          Permisos: {
            select: {
              nombre_permiso: true,
            },
          },
        },
      },
    },
  });
  
  if (roles.length === 0) {
    return NextResponse.json(
      { message: "No hay roles registrados." },
      { status: 404 }
    );
  }

  return NextResponse.json(roles);
}

// crear rol con permisos asociados

export async function POST(request: NextRequest) {
  const {
    rol,
    permisos,
  }: {
    rol: Rol;
    permisos: number[];
  } = await request.json();

  const { nombre_rol, descripcion } = rol;

  const nuevorol = await prisma.rol.create({
    data: {
      nombre_rol,
      descripcion,
      Rol_Permisos: {
        create: permisos.map((permiso) => ({
          permiso_id: permiso,
        })),
      },
    },
  });

  if (!nuevorol) {
    return NextResponse.json(
      { message: "No se pudo crear el rol." },
      { status: 500 }
    );
  }

  return NextResponse.json(nuevorol, { status: 201 });
}
