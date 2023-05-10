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
  ALL = "ALL",
}
enum Type {
  DOG = "DOG",
  CAT = "CAT",
  BIRD = "BIRD",
}
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NA = "NA",
}
enum Age {
  BELOW_ONE = "BELOW_ONE",
  ONE_TO_TWO = "ONE_TO_TWO",
  TWO_TO_FIVE = "TWO_TO_FIVE",
  OVER_FIVE = "OVER_FIVE",
}
export const userRouter = createTRPCRouter({
  onboarding: protectedProcedure
    .input(
      z.object({
        breed: z.string(),
        ageRange: z.nativeEnum(Age),
        gender: z.nativeEnum(Gender).optional(),
        type: z.nativeEnum(Type),
        children: z.enum(["true", "false"]),
        currentPet: z.nativeEnum(CurrentPet),
        garden: z.enum(["true", "false"]),
        active: z.enum(["true", "false"]),
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
        currentPet,
      } = input;

      const preferences = await ctx.prisma.preference.create({
        data: {
          userId: id,
          breed,
          ageRange,
          gender,
          type,
          currentPet,
          hasChildren: children === "true",
          hasGarden: garden === "true",
          isActive: active === "true",
        },
      });

      return preferences;
    }),
  createDonorProfile: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().regex(/^(\+254|0)[1-9]\d{8}$/),
        reason: z.string().min(10, { message: "too short" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const donorProfile= await ctx.prisma.donorProfile.create({
        data: {
          userId,
          reason: input.reason,
          phoneNumber: input.phoneNumber
        }
      })
      const donor=await ctx.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          role: "DONOR"
        }
      })
      return {donor, donorProfile}
    }),
  updatePreferences: protectedProcedure
    .input(
      z.object({
        breed: z.string(),
        ageRange: z.nativeEnum(Age),
        gender: z.nativeEnum(Gender).optional(),
        type: z.nativeEnum(Type),
        children: z.enum(["true", "false"]),
        garden: z.enum(["true", "false"]),
        active: z.enum(["true", "false"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = ctx.session.user.id;
      const { breed, ageRange, gender, type, children, garden, active } = input;

      const preferences = await ctx.prisma.preference.create({
        data: {
          userId: id,
          breed,
          ageRange,
          gender,
          type,
          hasChildren: children === "true",
          hasGarden: garden === "true",
          isActive: active === "true",
        },
      });
      const donor=await ctx.prisma.user.update({
        where: {
          id
        },
        data: {
          role: "ADOPTER"
        }
      })
      return { preferences, donor };
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session.user.id;

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return user;
  }),
  addToFavourites: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.prisma.favorite.create({
        data: {
          petId: input.id,
          userId,
        },
      });
    }),
  removeFromFavourites: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.favorite.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input.userId,
        },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
    }),
  getAll: protectedAdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    if (!users) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return users;
  }),
});
