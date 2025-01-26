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

export async function PUT(request: NextRequest) {
  const {
    rol,
    permisos,
  }: {
    rol: Rol;
    permisos: number[];
  } = await request.json();

  const { id_rol, nombre_rol, descripcion } = rol;

  const rolactualizado = await prisma.rol.update({
    where: {
      id_rol,
    },
    data: {
      nombre_rol,
      descripcion,
      Rol_Permisos: {
        deleteMany: {},
        create: permisos.map((permiso) => ({
          permiso_id: permiso,
        })),
      },
    },
  });

  if (!rolactualizado) {
    return NextResponse.json(
      { message: "No se pudo actualizar el rol." },
      { status: 500 }
    );
  }

  return NextResponse.json(rolactualizado, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("id"));

  if (!id) {
    return NextResponse.json(
      { message: "ID de rol no proporcionado" },
      { status: 400 }
    );
  }

  await prisma.rol_Permisos.deleteMany({
    where: {
      rol_id: id,
    },
  });

  const rol = await prisma.rol.delete({
    where: {
      id_rol: id,
    },
  });

  if (!rol) {
    return NextResponse.json(
      { message: "No se pudo eliminar el rol." },
      { status: 500 }
    );
  }

  return NextResponse.json(rol, { status: 200 });
}
