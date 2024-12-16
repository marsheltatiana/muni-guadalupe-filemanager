import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 1;

export async function GET(request: NextRequest) {
  const categories = await prisma.categoria_Documento.findMany();

  return NextResponse.json(categories);
}
