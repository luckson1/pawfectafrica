import { z } from "zod";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";

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

      const pet = await ctx.prisma.pet.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (pet.userId === userId) {
        return await ctx.prisma.pet.update({
          where: {
            id: input.id,
          },
          data: {
            userId,
            ...input,
          },
        });
      }
      throw new TRPCError({ code: "FORBIDDEN" });
    }),

  getAllPets: protectedAdminProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany({
      where: {
        deleted: false,
      },
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return pets;
  }),
  getOnePet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findFirstOrThrow({
        where: {
          id: input.id,
          deleted: false,
        },
      });
      if (!pet) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return pet;
    }),
  getPetsByType: protectedProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ ctx, input }) => {
      const pets = await ctx.prisma.pet.findMany({
        where: {
          type: input.type,
          deleted: false,
          adopted: false,
        },
      });
      if (!pets) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return pets;
    }),
  getDonorsPetsbyId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const pets = await ctx.prisma.pet.findMany({
        where: {
          userId: input.userId,
          deleted: false,
        },
      });
      if (!pets) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return pets;
    }),
  getDonatedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        adopted: false,
      },
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return pets;
  }),
  getDonorAdoptedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        adopted: true,
      },
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return pets;
  }),
  getUserFavouritePets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
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
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return pets;
  }),
  getUserAdoptedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
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
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return pets;
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
      const userId = ctx.session.user.id;
      const pet = await ctx.prisma.pet.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      if (pet.userId === userId) {
        return await ctx.prisma.pet.update({
          where: {
            id: input.id,
          },
          data: {
            deleted: true,
          },
        });
      }
      throw new TRPCError({ code: "FORBIDDEN" });
    }),
});
