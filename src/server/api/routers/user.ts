import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
enum CurrentPet {
  NONE = "NONE",
  CAT = "CAT",
  DOG = "DOG",
  BIRD = "BIRD",
}
export const userRouter = createTRPCRouter({
  onboarding: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().regex(/^(?:\+254|0)[1-9]\d{8}$/),
        breed: z.string(),
        ageRange: z.string(),
        gender: z.string(),
        type: z.string(),
        children: z.boolean(),
        garden: z.boolean(),
        active: z.boolean(),
        currentPet: z.nativeEnum(CurrentPet),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = ctx.session.user.id;
      const {
        phoneNumber,
        breed,
        ageRange,
        gender,
        type,
        children,
        garden,
        active,
        currentPet,
      } = input;

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          phoneNumber,
          currentPet,
        },
      });
      const preferences = await ctx.prisma.preference.create({
        data: {
          userId: id,
          breed,
          ageRange,
          gender,
          type,
          children,
          garden,
          active,
        },
      });

      return { updatedUser, preferences };
    }),

    updatePreferences: protectedProcedure
    .input(
      z.object({
        breed: z.string(),
        ageRange: z.string(),
        gender: z.string(),
        type: z.string(),
        children: z.boolean(),
        garden: z.boolean(),
        active: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = ctx.session.user.id;
      const {
   
        breed,
        ageRange,
        gender,
        type,
        children,
        garden,
        active,
       
      } = input;


      const preferences = await ctx.prisma.preference.create({
        data: {
          userId: id,
          breed,
          ageRange,
          gender,
          type,
          children,
          garden,
          active,
        },
      });

      return { preferences };
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session.user.id;

    const user=await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    if (!user) {
      throw new TRPCError({code: "NOT_FOUND"})
    } return user
  }),
  addToFavourites: protectedProcedure.input(z.object({id:z.string()})).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    return await ctx.prisma.favorite.create({
      data: {
       petId: input.id,
       userId
      },
    });
  }),
  removeFromFavourites:protectedProcedure.input(z.object({id:z.string()})).mutation(async ({ ctx, input }) => {
   

    return await ctx.prisma.favorite.delete({
     where: {
id:input.id
     }
    });
  }),
  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user= await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input.userId,
        },
      });
      if (!user) {
        throw new TRPCError({code: "NOT_FOUND"})
      } return user
    }),
  getAll: protectedAdminProcedure.query(async({ ctx }) => {
     const users=await ctx.prisma.user.findMany();
     if (!users) {
      throw new TRPCError({code: "NOT_FOUND"})
    } return users
  }),
});
