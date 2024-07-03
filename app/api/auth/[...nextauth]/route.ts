import NextAuth from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

// Define the NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db
          .collection("users")
          .findOne({ email: credentials?.email });

        if (user && (await compare(credentials!.password, user.password))) {
          return { id: user._id.toString(), email: user.email };
        }

        return null;
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

// Export the handler for the POST method
export const POST = async (req: NextRequest, res: NextResponse) => {
  return NextAuth(authOptions)(req, res);
};

// Export the handler for the GET method
export const GET = async (req: NextRequest, res: NextResponse) => {
  return NextAuth(authOptions)(req, res);
};
