import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const users = await prisma.usuario.findMany({
    include: {
      Rol: true,
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
  const {
    name,
    email,
    password: passwordTextPlain,
    role,
  } = await request.json();

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

export async function PUT(request: NextRequest) {
  const {
    name,
    email,
    password: passwordTextPlain,
    role,
  } = await request.json();

  if (passwordTextPlain === "" || passwordTextPlain === null) {
    const user = await prisma.usuario.update({
      where: {
        email: email,
      },
      data: {
        nombre: name,
        email,
        Rol: {
          connect: {
            id_rol: Number.parseInt(role),
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No se pudo actualizar el usuario." },
        { status: 500 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } else {
    const hashPwd = await bcrypt.hash(passwordTextPlain, 14);

    const user = await prisma.usuario.update({
      where: {
        email: email,
      },
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
        { message: "No se pudo actualizar el usuario." },
        { status: 500 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "No se proporcionó un ID de usuario." },
      { status: 400 }
    );
  }

  const user = await prisma.usuario.delete({
    where: {
      id_usuario: Number.parseInt(id),
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "No se pudo eliminar el usuario." },
      { status: 500 }
    );
  }

  return NextResponse.json(user, { status: 200 });
}
