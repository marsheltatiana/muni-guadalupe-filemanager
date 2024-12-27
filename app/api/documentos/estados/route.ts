import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
  
    if (!id) {
      return NextResponse.json(
        { message: "El ID es requerido para actualizar el documento." },
        { status: 400 }
      );
    }
  
    try {
      const { estado } = await req.json();
  
      if (estado === undefined) {
        return NextResponse.json(
          { message: "El estado es requerido para actualizar el documento." },
          { status: 400 }
        );
      }
  
      const updatedDocumento = await prisma.documento.update({
        where: {
          id: id,
        },
        data: {
          estado,
        },
      });
  
      return NextResponse.json(
        {
          message: "Documento actualizado correctamente.",
          updatedDocumento,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Error al actualizar el documento.",
          error: error instanceof Error ? error.message : "Error desconocido",
        },
        { status: 500 }
      );
    }
  }