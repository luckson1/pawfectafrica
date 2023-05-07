import { z } from "zod";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
} from "../trpc";

export const petRouter = createTRPCRouter({
  createPetProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        breed: z.string(),
        ageRange: z.string(),
        gender: z.string(),
        type: z.string(),
        children: z.boolean(),
        garden: z.boolean(),
        active: z.boolean(),
        description: z.string(),
        petTorrelance: z.string(),
        neutered: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const pet = await ctx.prisma.pet.create({
        data: {
          userId,
          ...input,
        },
      });
      return pet;
    }),

  updatePetProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        breed: z.string(),
        ageRange: z.string(),
        gender: z.string(),
        type: z.string(),
        children: z.boolean(),
        garden: z.boolean(),
        active: z.boolean(),
        description: z.string(),
        petTorrelance: z.string(),
        id: z.string(),
        neutered: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const pet = await ctx.prisma.pet.update({
        where: {
          id: input.id,
        },
        data: {
          userId,
          ...input,
        },
      });
      return pet;
    }),

  getAllPets: protectedAdminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pet.findMany({
      where: {
        deleted: false,
      },
    });
  }),
  getOnePet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pet.findFirstOrThrow({
        where: {
          id: input.id,
          deleted: false,
        },
      });
    }),
  getPetsByType: protectedProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pet.findMany({
        where: {
          type: input.type,
          deleted: false,
          adopted: false,
        },
      });
    }),
  getDonorsPetsbyId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pet.findMany({
        where: {
          userId: input.userId,
          deleted: false,
        },
      });
    }),
  getDonatedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        adopted: false,
      },
    });
  }),
  getDonorAdoptedPets: protectedProcedure.query(
    async ({ ctx}) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.pet.findMany({
        where: {
          userId,
          deleted: false,
          adopted: true,
        },
      });
    }
  ),
  getUserFavouritePets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        adopted: false,
        Favorite: {
          some: {
            userId,
          },
        },
      },
    });
  }),
  getUserAdoptedPets: protectedProcedure.query(async ({ ctx}) => {
    const userId = ctx.session.user.id;
    return await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        adopted: true,
        Adoption: {
          some: {
            userId,
          },
        },
      },
    });
  }),
  addAdoption: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const adoptedPet = await ctx.prisma.pet.update({
        where: {
          id: input.id,
        },
        data: {
          adopted: true,
        },
      });

      const adoption = await ctx.prisma.adoption.create({
        data: {
          userId,
          petId: input.id,
        },
      });
      return { adoptedPet, adoption };
    }),
  deletePet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pet.update({
        where: {
          id: input.id,
        },
        data: {
          deleted: true,
        },
      });
    }),
});
