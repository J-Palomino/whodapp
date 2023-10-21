import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";


export const userRouter = createTRPCRouter({

    getUsers: publicProcedure.query(({ ctx }) => {
        return ctx.db.user.findMany();
    }),
    getUserById: protectedProcedure.query(({ ctx }) => {
        return ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
        });
    }),
    createUser: publicProcedure.input(z.object({
        name: z.string().nullish(),
        email: z.string().email().nullish(),
        image: z.string().url().nullish(),
    })).mutation(({ ctx, input }) => {
        return ctx.db.user.create({
            data: {
                name: input.name,
                email: input.email,
                image: input.image,
            },
        });
    }),
    updateUser: protectedProcedure.input(z.object({
        name: z.string().nullish(),
        email: z.string().email().nullish(),
        image: z.string().url().nullish(),
    })).mutation(({ ctx, input }) => {
        return ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                name: input.name,
                email: input.email,
                image: input.image,
            },
        });
    }),
    deleteUser: protectedProcedure.mutation(({ ctx }) => {
        return ctx.db.user.delete({
            where: {
                id: ctx.session.user.id,
            },
        });
    }),
    
    


   

    
})