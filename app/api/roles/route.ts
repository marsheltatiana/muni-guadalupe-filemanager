import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const roles = await prisma.rol.findMany();

  if (roles.length === 0) {
    return NextResponse.json(
      { message: "No hay roles registrados." },
      { status: 404 }
    );
  }

  return NextResponse.json(roles);
}
