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

export const petRouter = createTRPCRouter({
  createPetProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name Required" }),
        description: z.string().min(10, { message: "Description too short" }),
        background: z.string().min(10, { message: "backround too short" }),
        idealHome: z.string().min(10, { message: "idealHome too short" }),
        neutered: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        breed: z.string().min(1, { message: "Breed Required" }).nullable(),
        ageRange: z.enum(
          ["BELOW_ONE", "ONE_TO_TWO", "TWO_TO_FIVE", "OVER_FIVE"],
          {
            errorMap: () => {
              return { message: "Please select one of the options" };
            },
          }
        ),
        gender: z.enum(["MALE", "FEMALE", "NA"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        type: z.enum(["DOG", "CAT", "BIRD"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        children: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        garden: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        active: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        torrelance: z.array(
          z.object({
            value: z.enum(["NONE", "CAT", "DOG", "BIRD", "ALL"]),
            label: z.string(),
          }),
          {
            errorMap: () => {
              return { message: "Please select one of the options" };
            },
          }
        ),
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
        torrelance,
        neutered,
        background,
        idealHome
      } = input;
      const getTorrelance = () => {
       
        const petTorrelance = torrelance.some((obj) => obj.value === "NONE")
          ? "NONE"
          : torrelance.length === 1 &&
            torrelance.some((obj) => obj.value === "DOG")
          ? "DOG"
          : torrelance.length === 1 &&
            torrelance.some((obj) => obj.value === "CAT")
          ? "CAT"
          : torrelance.length === 1 &&
            torrelance.some((obj) => obj.value === "BIRD")
          ? "BIRD"
          : torrelance.length === 3 &&
            torrelance.some((obj) => obj.value !== "NONE")
          ? "ALL"
          : torrelance.length == 2 &&
            torrelance.some((obj) => obj.value === "BIRD") &&
            torrelance.some((obj) => obj.value === "CAT")
          ? "CAT_BIRD"
          : torrelance.length == 2 &&
            torrelance.some((obj) => obj.value === "BIRD") &&
            torrelance.some((obj) => obj.value === "DOG")
          ? "DOG_BIRD"
          : torrelance.length == 2 &&
            torrelance.some((obj) => obj.value === "DOG") &&
            torrelance.some((obj) => obj.value === "CAT")
          ? "DOG_CAT"
          : "NONE";
        return petTorrelance;
      };

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
          petTorrelance: getTorrelance(),
          isNeutered: neutered === "true",
          background,
          idealHome
        },
      });
      return pet;
    }),

  updatePetProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name Required" }),
        description: z.string().min(10, { message: "Description too short" }),
        idealHome: z.string().min(10, { message: "idealHome too short" }),
        background: z.string().min(10, { message: "backround too short" }),
        neutered: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        breed: z.string().min(1, { message: "Breed Required" }).nullable(),
        ageRange: z.enum(
          ["BELOW_ONE", "ONE_TO_TWO", "TWO_TO_FIVE", "OVER_FIVE"],
          {
            errorMap: () => {
              return { message: "Please select one of the options" };
            },
          }
        ),
        gender: z.enum(["MALE", "FEMALE", "NA"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        type: z.enum(["DOG", "CAT", "BIRD"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        children: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        garden: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        active: z.enum(["true", "false"], {
          errorMap: () => {
            return { message: "Please select one of the options" };
          },
        }),
        id: z.string(),
        torrelance: z.array(
          z.object({
            value: z.enum(["NONE", "CAT", "DOG", "BIRD", "ALL"]),
            label: z.string(),
          }),
          {
            errorMap: () => {
              return { message: "Please select one of the options" };
            },
          }
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const {
        name,
        torrelance,
        breed,
        ageRange,
        gender,
        type,
        children,
        garden,
        active,
        description,
        background,
        idealHome,
        neutered,
      } = input;
      const getTorrelance = () => {
       
        const petTorrelance = torrelance.some((obj) => obj.value === "NONE")
          ? "NONE"
          : torrelance.length === 1 &&
            torrelance.some((obj) => obj.value === "DOG")
          ? "DOG"
          : torrelance.length === 1 &&
            torrelance.some((obj) => obj.value === "CAT")
          ? "CAT"
          : torrelance.length === 1 &&
            torrelance.some((obj) => obj.value === "BIRD")
          ? "BIRD"
          : torrelance.length === 3 &&
            torrelance.some((obj) => obj.value !== "NONE")
          ? "ALL"
          : torrelance.length == 2 &&
            torrelance.some((obj) => obj.value === "BIRD") &&
            torrelance.some((obj) => obj.value === "CAT")
          ? "CAT_BIRD"
          : torrelance.length == 2 &&
            torrelance.some((obj) => obj.value === "BIRD") &&
            torrelance.some((obj) => obj.value === "DOG")
          ? "DOG_BIRD"
          : torrelance.length == 2 &&
            torrelance.some((obj) => obj.value === "DOG") &&
            torrelance.some((obj) => obj.value === "CAT")
          ? "DOG_CAT"
          : "NONE";
        return petTorrelance;}
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
            petTorrelance: getTorrelance(),
            isChildrenSafe: children === "true",
            isNeedGarden: garden === "true",
            isActive: active === "true",
            description,
            isNeutered: neutered === "true",
            background,
            idealHome
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
    const userId = ctx.session.user.id;
    const pets = await ctx.prisma.pet.findMany({
      where: {
        deleted: false,
        isAdopted: false,
        NOT: {
          Favorite: {
            some: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
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
      take: 8,
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
        status: z.enum(["ACCEPTED"]),
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
  rejectAdoptionApplication: protectedProcedure
    .input(
      z.object({
        status: z.enum(["REJECTED"]),
        id: z.string(),
        userId: z.string(),
        petId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const rejectedApplication = await ctx.prisma.adoptionInterest.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return rejectedApplication;
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
