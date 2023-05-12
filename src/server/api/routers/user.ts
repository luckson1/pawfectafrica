import { TRPCError } from "@trpc/server";
import { S3 } from "aws-sdk";
import { z } from "zod";
import { env } from "~/env.mjs";

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

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
  region: env.REGION,
  signatureVersion: "v4",
});

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
      const user = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          role: "ADOPTER",
        },
      });
      return { preferences, user };
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
      const donorProfile = await ctx.prisma.donorProfile.create({
        data: {
          userId,
          reason: input.reason,
          phoneNumber: input.phoneNumber,
        },
      });
      const donor = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: "DONOR",
        },
      });
      return { donor, donorProfile };
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

      const donor = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          role: "ADOPTER",
        },
      });
      return { preferences, donor };
    }),
    initiateAdoption: protectedProcedure.input(z.object({id: z.string()})).mutation(async({ctx, input})=> {
      const userId=ctx.session.user.id
      await ctx.prisma.adoptionInterest.create({
        data: {
          userId,
          petId: input.id
        }
      })
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
        include: {
          Preference: true
        }
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
  getAllAdopters: protectedAdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        role: "ADOPTER",
      },
      include: {
        Preference: {
          select: {
            type: true,
          },
        },
        Adoption: {
          select: {
            pet: {
              select: {
                id: true,
                Image: {
                  select: {
                    id: true,
                    petId: true
                  },
                },
              },
            },
          },
        },
        Favorite: {
          select: {
            pet: {
           
              select: {
                id: true,
                Image: {
                  select: {
                    id: true,
                    petId: true
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!users) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const usersWithPetImageUrls = await Promise.all(
      users.map(async (user) => {
        const adoptionsWithImageUrls = await Promise.all(
          user.Adoption.map(async (adoption) => {
            const petWithImageUrl = {
              ...adoption.pet,
              Image: await Promise.all(
                adoption.pet.Image.map(async (image) => ({
                  ...image,
                  url: await s3.getSignedUrlPromise("getObject", {
                    Bucket: env.BUCKET_NAME,
                    Key: `${image.id}`,
                  }),
                }))
              ),
            };
            return petWithImageUrl;
          })
        );

        const favoritesWithImageUrls = await Promise.all(
          user.Favorite.map(async (favorite) => {
            const petWithImageUrl = {
              ...favorite.pet,
              Image: await Promise.all(
                favorite.pet.Image.map(async (image) => ({
                  ...image,
                  url: await s3.getSignedUrlPromise("getObject", {
                    Bucket: env.BUCKET_NAME,
                    Key: `${image.id}`,
                  }),
                }))
              ),
            };
            return petWithImageUrl;
          })
        );

        const userWithImageUrls = {
          ...user,
          Adoption: adoptionsWithImageUrls,
          Favorite: favoritesWithImageUrls,
        };

        return userWithImageUrls;
      })
    );

    return usersWithPetImageUrls;
  }),

  getAllDonors: protectedAdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        OR: [{ role: "ADMIN" }, { role: "DONOR" }],
      },
      include: {
        Pet: {
          select: {
         id: true,
            Image: {
              select: {
                id: true,
                petId: true,
              },
            },
          },
        },
      },
    });
  
    const usersWithImageUrls = await Promise.all(
      users.map(async (user) => {
        const petsWithImageUrls = await Promise.all(
          user.Pet.map(async (pet) => {
            const petWithImageUrl = {
              ...pet,
              Image: await Promise.all(
                pet.Image.map(async (image) => ({
                  ...image,
                  url: await s3.getSignedUrlPromise("getObject", {
                    Bucket: env.BUCKET_NAME,
                    Key: `${image.id}`,
                  }),
                }))
              ),
            };
            return petWithImageUrl;
          })
        );
  
        const userWithImageUrls = {
          ...user,
          Pet: petsWithImageUrls,
        };
  
        return userWithImageUrls;
      })
    );
  
    if (!usersWithImageUrls) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
  
    return usersWithImageUrls;
  }),
  
});
