import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const transacciones = await prisma.transaccion.findMany({
      include: {
        Usuario: true,
        Documento: true
      }
    });

    if (!transacciones) {
      return NextResponse.json(
        { error: "No se encontraron transacciones" },
        { status: 404 }
      );
    }

    return NextResponse.json(transacciones, { status: 200 });
  } catch (error) {
    console.error("Error fetching transacciones:", error);
    return NextResponse.json(
      { error: "Error al obtener las transacciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    const transaccion = await prisma.transaccion.create({
      data: {
        usuario_id: json.usuario_id,
        documento_id: json.documento_id,
        tipo_transaccion: json.tipo_transaccion,
        fecha_inicio: new Date(json.fecha_inicio),
        fecha_fin: json.fecha_fin ? new Date(json.fecha_fin) : null,
      },
    });

    return NextResponse.json(transaccion, { status: 201 });
  } catch (error) {
    console.error("Error creating transaccion:", error);
    return NextResponse.json(
      { error: "Error al crear la transacción" },
      { status: 500 }
    );
  }
}
