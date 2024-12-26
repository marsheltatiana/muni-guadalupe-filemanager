import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const transacciones = await prisma.transaccion.findMany();
    return NextResponse.json(transacciones, { status: 200 });
  } catch (error) {
    console.error("Error fetching transacciones:", error);
    return NextResponse.json(
      { error: "Error al obtener las transacciones" },
      { status: 500 }
    );
  }
}
