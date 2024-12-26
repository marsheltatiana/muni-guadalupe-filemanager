import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DURACION DE BUSQUEDA", body.search_duration);
    const estadisticaBusqueda = await prisma.estadistica_busqueda.create({
      data: {
        consulta: body.consulta as string,
        tiempo_segundos: Number.parseFloat(body.tiempo_segundos.toFixed(2)),
      },
    });

    return NextResponse.json(estadisticaBusqueda, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
