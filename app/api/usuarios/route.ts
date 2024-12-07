import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const users = await prisma.usuario.findMany({
    include: {
      Rol: {
        select: {
          nombre_rol: true,
        },
      },
    },
  });

  if (users.length === 0) {
    return NextResponse.json(
      { message: "No hay usuarios registrados." },
      { status: 404 }
    );
  }

  return NextResponse.json(users);
}

// Crear un usuario

export async function POST(request: NextRequest) {
  const { name, email, rol } = await request.json();

  const role = await prisma.rol.findFirst({
    where: {
      nombre_rol: rol as string,
    },
  });

  const user = await prisma.usuario.create({
    data: {
      nombre: name,
      email,
      Rol: {
        connect: {
          id_rol: role?.id_rol,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "No se pudo crear el usuario." },
      { status: 500 }
    );
  }

  return NextResponse.json(user, { status: 201 });
}
