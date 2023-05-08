import { z } from "zod";
import S3 from "aws-sdk/clients/s3";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "process";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
  region: env.REGION,
  signatureVersion: "v4",
});

enum Type {
  DOG="DOG",
  CAT="CAT",
  BIRD="BIRD"
}
export const petRouter = createTRPCRouter({
  createPetProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        breed: z.string(),
        ageRange: z.string(),
        gender: z.string(),
        type: z.nativeEnum(Type),
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
        type: z.nativeEnum(Type),
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

  getAllPets: protectedProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany({
      where: {
        deleted: false,
      },
      include: {
        Image: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    // attach image urls to the pet object
    const petsWithImageUrls = await Promise.all(
      pets.map(async (pet) => {
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
    return petsWithImageUrls;
  }),
  getFeaturedPets: publicProcedure.query(async ({ ctx }) => {
    const pets = await ctx.prisma.pet.findMany({
      where: {
        deleted: false,
      },
      include: {
        Image: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 6,
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    // attach image urls from s3 to the pet object
    const petsWithImageUrls = await Promise.all(
      pets.map(async (pet) => {
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
    return petsWithImageUrls;
  }),
  getOnePet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findFirstOrThrow({
        where: {
          id: input.id,
          deleted: false,
        },
        include: {
          Image: {
            select: {
              id: true
            }
          }
        }
      });
      if (!pet) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
// attach images url from S3 storage to pet object
      const petWithImageUrls = {
        ...pet,
        Image: pet.Image.map(async(image) => ({
          ...image,
          url: await s3.getSignedUrlPromise("getObject", {
            Bucket: env.BUCKET_NAME,
            Key: `${image.id}`,
          }),
        })),
      };
     return petWithImageUrls
    }),
  getPetsByType: protectedProcedure
    .input(z.object({ type: z.nativeEnum(Type) }))
    .query(async ({ ctx, input }) => {
      const pets = await ctx.prisma.pet.findMany({
        where: {
          type: input.type,
          deleted: false,
          adopted: false,
        },
        include: {
          Image: {
            select: {
              id: true
            }
          }
        }
      });
      if (!pets) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
        // attach image urls from s3 to the pet object
    const petsWithImageUrls = await Promise.all(
      pets.map(async (pet) => {
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
    return petsWithImageUrls;
    }),
  getDonorsPetsbyId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const pets = await ctx.prisma.pet.findMany({
        where: {
          userId: input.userId,
          deleted: false,
        },
        include: {
          Image: {
            select: {
              id: true
            }
          }
        }
      });
      if (!pets) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      // attach image urls from s3 to the pet object
      const petsWithImageUrls = await Promise.all(
        pets.map(async (pet) => {
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
      return petsWithImageUrls;
    }),
  getDonatedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        adopted: false,
      },
      include: {
        Image: {
          select: {
            id: true
          }
        }
      }
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    // attach image urls from s3 to the pet object
    const petsWithImageUrls = await Promise.all(
      pets.map(async (pet) => {
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
    return petsWithImageUrls;
  }),
  getDonorAdoptedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        adopted: true,
      },
      include: {
        Image: {
          select: {
            id: true
          }
        }
      }
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
  // attach image urls from s3 to the pet object
  const petsWithImageUrls = await Promise.all(
    pets.map(async (pet) => {
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
  return petsWithImageUrls;
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
      include: {
        Image: {
          select: {
            id: true
          }
        }
      }
    });
    if (pets === undefined) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
  // attach image urls from s3 to the pet object
  const petsWithImageUrls = await Promise.all(
    pets.map(async (pet) => {
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
  return petsWithImageUrls;
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
      include: {
        Image: {
          select: {
            id: true
          }
        }
      }
    });
    if (!pets) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
  // attach image urls from s3 to the pet object
  const petsWithImageUrls = await Promise.all(
    pets.map(async (pet) => {
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
  return petsWithImageUrls;
  }),
  addAdoption: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
    .mutation(async ({ ctx, input }) => {
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
