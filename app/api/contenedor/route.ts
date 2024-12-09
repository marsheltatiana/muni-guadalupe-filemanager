import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json()

    console.log(JSON.stringify(body))

    const tipoContainer = await prisma.tipo_Contenedor.findFirst({
        where: {
            nombre: body.tipo
        }
    })

    const anioDate = new Date(`${body.año}-01-01`);
    const container = await prisma.contenedor.create({
        data: {
            nombre: body.nombre,
            descripcion: body.descripcion,
            fila: body.fila,
            columna: body.columna,
            anio: anioDate,
            Tipo_Contenedor: {
                connect: {
                    id_tipo_contenedor: tipoContainer?.id_tipo_contenedor
                }
            },
            Estante: {
                connect: {
                    id_estante: body.id_stante
                }
            }
        }
    })

    if (container === null) {
        return NextResponse.json(
            {
              message: "No se puedo registrar el contenedor",
            },
            { status: 404 }
          );
        }
      
    return NextResponse.json(container);
}