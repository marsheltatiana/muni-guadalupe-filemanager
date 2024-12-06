import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // check if the user exists in the database

      const prismaUser = await prisma.usuario.findFirst({
        where: {
          email: user.email,
        },
      });

      if (!prismaUser) {
        // if the user does not exist, create it

        const roleTrabajador = await prisma.rol.findFirst({
          where: {
            nombre_rol: "Trabajador",
          },
        });

        if (!roleTrabajador) {
          const role = await prisma.rol.create({
            data: {
              nombre_rol: "Trabajador",
              descripcion: "Rol por defecto para los trabajadores.",
            },
          });
        }

        await prisma.usuario.create({
          data: {
            email: user.email,
            nombre: user.name,
            imagen_perfil: user.image,
            Rol: {
              connect: {
                id_rol: roleTrabajador?.id_rol,
              },
            },
          },
        });
      }

      return true;
    },
  },
});
