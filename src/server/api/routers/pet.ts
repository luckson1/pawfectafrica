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
enum CurrentPet {
  NONE = "NONE",
  CAT = "CAT",
  DOG = "DOG",
  BIRD = "BIRD",
  ALL = "ALL",
}
export const petRouter = createTRPCRouter({
  createPetProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        breed: z.string(),
        ageRange: z.nativeEnum(Age),
        gender: z.nativeEnum(Gender),
        type: z.nativeEnum(Type),
        children: z.enum(["true", "false"]),
        garden: z.enum(["true", "false"]),
        active: z.enum(["true", "false"]),
        description: z.string(),
        petTorrelance: z.nativeEnum(CurrentPet),
        neutered: z.enum(["true", "false"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const {
        name,
        breed,
        ageRange,
        gender,
        type,
        children,
        garden,
        active,
        description,
        petTorrelance,
        neutered,
      } = input;
      const pet = await ctx.prisma.pet.create({
        data: {
          userId,
          name,
          breed,
          ageRange,
          gender,
          type,
          isChildrenSafe: children === "true",
          isNeedGarden: garden === "true",
          isActive: active === "true",
          description,
          petTorrelance,
          isNeutered: neutered === "true",
        },
      });
      return pet;
    }),

  updatePetProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        breed: z.string(),
        ageRange: z.nativeEnum(Age),
        gender: z.nativeEnum(Gender),
        type: z.nativeEnum(Type),
        children: z.enum(["true", "false"]),
        garden: z.enum(["true", "false"]),
        active: z.enum(["true", "false"]),
        description: z.string(),
        petTorrelance: z.nativeEnum(CurrentPet),
        id: z.string(),
        neutered: z.enum(["true", "false"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const {
        name,
        breed,
        ageRange,
        gender,
        type,
        children,
        garden,
        active,
        description,
        petTorrelance,
        neutered,
      } = input;
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
            name,
            breed,
            ageRange,
            gender,
            type,
            isChildrenSafe: children === "true",
            isNeedGarden: garden === "true",
            isActive: active === "true",
            description,
            petTorrelance,
            isNeutered: neutered === "true",
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
      include: {
        Image: {
          select: {
            id: true,
          },
        },
        donor: {
          select: {
            id: true,
            image: true,
          },
        },
        Adoption: {
          select: {
            user: {
              select: {
                id: true,
                image: true,
              },
            },
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
  getAllUnadoptedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId=ctx.session.user.id
    const pets = await ctx.prisma.pet.findMany({
      where: {
        deleted: false,
        isAdopted: false,
        NOT: {
          Favorite: {
            some: {
  userId
            }
          }
        }
      },
      select: {
        id:true,
        name:true,
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
        isAdopted: false,
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
              id: true,
            },
          },
          AdoptionInterest: {
            select: {
              id: true,
              userId: true,
              status: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          donor: {
            select: {
              id: true,
              name: true,
              DonorProfile: {
                select: {
                  phoneNumber: true,
                },
              },
            },
          },
        },
      });
      if (!pet) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      // attach images url from S3 storage to pet object
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
    }),

  getPetsByType: protectedProcedure
    .input(z.object({ type: z.nativeEnum(Type) }))
    .query(async ({ ctx, input }) => {
      const pets = await ctx.prisma.pet.findMany({
        where: {
          type: input.type,
          deleted: false,
          isAdopted: false,
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
              id: true,
            },
          },
        },
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
  getUserDonatedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
      where: {
        userId,
        deleted: false,
        isAdopted: false,
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
        isAdopted: true,
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
        deleted: false,
        isAdopted: false,
        Favorite: {
          some: {
            userId,
          },
        },
      },
      include: {
        Image: {
          select: {
            id: true,
          },
        },
      },
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

  acceptAdoptionApplication: protectedProcedure
    .input(
      z.object({
        status: z.enum(["ACCEPTED", "REJECTED"]),
        id: z.string(),
        userId: z.string(),
        petId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const acceptedApplication = await ctx.prisma.adoptionInterest.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
      const adoption = await ctx.prisma.adoption.create({
        data: {
          userId: input.userId,
          petId: input.petId,
        },
      });
      const successfulAdoption = await ctx.prisma.pet.update({
        where: {
          id: input.petId,
        },

        data: {
          isAdopted: true,
        },
      });
      return { acceptedApplication, adoption, successfulAdoption };
    }),
  getUserAdoptedPets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
      where: {
        deleted: false,
        isAdopted: true,
        Adoption: {
          some: {
            userId,
          },
        },
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
          isAdopted: true,
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
