import { NextRequest } from "next/server";

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
 
  if (!filename) return NextResponse.json({
    error: "No se pudo subir el archivo"
  });

  const blob = await put(`${filename}.pdf`, request.body!, {
    access: 'public',
  });
 

  return NextResponse.json(blob);
}