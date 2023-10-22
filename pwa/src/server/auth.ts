import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import CredentialsProvider from 'next-auth/providers/credentials'
import {getAddress} from 'ethers'
import NextAuth from "next-auth";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { env } from "@/env.mjs";
import { db } from "./db";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      address: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
 
  adapter: PrismaAdapter(db),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials:{
        address: {
           label: "Address",
            type: "text", 
            placeholder: "0x..." 
          },
      },
    async authorize(credentials)  {
    if(Boolean(getAddress(credentials?.address!))){
      return null
    }
    const user = await db.user.findUnique({
      where: {
        wallet: credentials?.address,
      },
    })
    if(!user){
      return null
    }
    return{
      id: user.id,
      wallet: credentials?.address,
    }
    },
    session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
   jwt:{
     secret: process.env.JWT_SECRET,
   },
   callbacks: {
    async session ({ session, token }) {
   session.address = token.sub
   return {...session,
   id: token.id,
   address: token.address,
  }
   
   },
   jwt: async (token, user, account, profile, isNewUser) => {
    if(user){
      return {
        ...token,
         id: user.id,
         address: user.wallet,
        }
    }
   
  }
 },
 secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    newUser: '/',
  },
    
}),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],

};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
