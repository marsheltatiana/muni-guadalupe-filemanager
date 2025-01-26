import prisma from "@/lib/db";
import { AuthenticatedUser } from "@/lib/types/user";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    let user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        Rol: {
          include: {
            Rol_Permisos: {
              include: {
                Permisos: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.contrasenia);

    if (!passwordsMatch) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (!user.Rol?.nombre_rol) {
      const adminRole = await prisma.rol.findFirst({
        where: {
          nombre_rol: "Admin",
        },
      });

      if (!adminRole) return;

      if (process.env.SUPERADMIN_EMAIL === user.email) {
        await prisma.usuario.update({
          where: {
            email: user.email,
          },
          data: {
            rol_id: adminRole.id_rol,
          },
        });
      } else {
        const trabajadorRole = await prisma.rol.findFirst({
          where: {
            nombre_rol: "Trabajador",
          },
        });

        if (!trabajadorRole) return;

        await prisma.usuario.update({
          where: {
            email: user.email,
          },
          data: {
            rol_id: trabajadorRole.id_rol,
          },
        });
      }

      user = await prisma.usuario.findUnique({
        where: {
          id_usuario: user.id_usuario,
        },
        include: {
          Rol: {
            include: {
              Rol_Permisos: {
                include: {
                  Permisos: true,
                },
              },
            },
          },
        },
      });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const authenticadedUser: AuthenticatedUser = {
      name: user.nombre,
      email: email,
      role: {
        name: user.Rol!.nombre_rol!,
        permissions: user.Rol!.Rol_Permisos?.map((rp) => {
          return {
            name: rp.Permisos!.nombre_permiso!,
          };
        })!,
      },
    };

    return NextResponse.json(authenticadedUser);
  } catch (error) {
    console.error("Error in bcrypt handler:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
