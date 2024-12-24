import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

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

export async function POST(request: NextRequest) {
  const { name, email, password: passwordTextPlain, role } = await request.json();

  const hashPwd = await bcrypt.hash(passwordTextPlain, 14);

  const user = await prisma.usuario.create({
    data: {
      nombre: name,
      email,
      contrasenia: hashPwd,
      Rol: {
        connect: {
          id_rol: Number.parseInt(role),
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
