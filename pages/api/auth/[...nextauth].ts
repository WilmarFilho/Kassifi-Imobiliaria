import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" }
      },

      async authorize(credentials) {

        console.log("Authorize called");
        console.log(credentials);
        if (!credentials?.email || !credentials.password) return null;



        // Busca o usuário no banco pelo email
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        // Verifica senha 
        const isValid = credentials.password === user.senha;
        if (!isValid) return null;

        // Retorna objeto do usuário para a sessão
        return {
          id: user.id,
          name: user.nome,
          email: user.email
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
};

export default NextAuth(authOptions);


