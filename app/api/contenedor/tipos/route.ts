import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = await prisma.tipo_Contenedor.findMany();

  if (response.length === 0) {
    return NextResponse.json(
      {
        message: "No se encontraron registros",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(response);
}
