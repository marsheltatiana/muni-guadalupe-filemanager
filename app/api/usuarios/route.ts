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
