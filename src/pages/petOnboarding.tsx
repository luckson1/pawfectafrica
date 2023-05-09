import React, { useEffect } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import { api } from "~/utils/api";
import LoadingButton from "~/components/loading/LoadingButton";
import { useSession } from "next-auth/react";
import { LoginCard } from "~/components/authCard";
import Loading from "~/components/loading/pageSkeleton";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Nav } from "~/components/Nav";
import Dropzone from "~/components/Dropezone";
enum CurrentPet {
  NONE = "NONE",
  CAT = "CAT",
  DOG = "DOG",
  BIRD = "BIRD",
}
enum Type {
  DOG = "DOG",
  CAT = "CAT",
  BIRD = "BIRD",
}
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NA="NA"
}

enum Age {
    BELOW_ONE="BELOW_ONE",
    ONE_TO_TWO= "ONE_TO_TWO",
    TWO_TO_FIVE="TWO_TO_FIVE",
    OVER_FIVE="OVER_FIVE"
}
const DonorSchema = z.object({
name: z.string().min(1, { message: 'Name Required' }),
description: z.string().min(10, { message: 'Description too short' }),
neutered: z.enum(['true', 'false'], {errorMap: ()=> {return {message: "Please select one of the options"}}}),
    breed: z.string().min(1, { message: 'Breed Required' }),
  ageRange: z.nativeEnum(Age, {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  gender: z.nativeEnum(Gender, {errorMap: ()=> {return {message: "Please select one of the options"}}} ),
  type: z.nativeEnum(Type,{errorMap: ()=> {return {message: "Please select one of the options"}}} ),
  children: z.enum(['true', 'false'], {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  garden: z.enum(['true', 'false'], {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  active: z.enum(['true', 'false'], {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  petTorrelance: z.nativeEnum(CurrentPet, {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  images: z.array(z.object({
    name: z.string().nonempty(),
    file: z.object({
      size: z.number().max(5000000),
      type: z.string().regex(/^image\/.+$/)
    })
  })),
});

export type DonorValues = z.infer<typeof DonorSchema>;
const PetOnboarding = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<DonorValues>({
    resolver: zodResolver(DonorSchema),
  });
  const { data, status } = useSession();
  const { field } = useController({ name: "images", control });
  const userRole = data?.user?.role;
  const isOnboarded = userRole === "ADOPTER";
  const isLoadingStatus = status === "loading";
  const isUnAthorised = status === "unauthenticated";
  const router = useRouter();
  useEffect(() => {
    if (isOnboarded) router.push("/dashboard");
  }, [isOnboarded, router]);

  const { mutate: onboarding, isLoading } = api.pet.createPetProfile.useMutation({
    onSuccess: () => router.push("/dashboard"),
  });

  const onSubmit = handleSubmit((data) => {
    onboarding(data);
  });

  if (isUnAthorised) return <LoginCard />;
  if (isLoadingStatus)
    return (
      <div className="h-[300px] w-[300px]">
        <Loading />
      </div>
    );
    console.log(watch("children"))
  return (
    <>
    <Nav />
    <div className="mb-2 mt-0  flex w-full max-full items-center justify-center rounded-md bg-base-100  md:mt-16">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex h-fit w-full flex-col rounded-md bg-base-100 bg-opacity-40 shadow-lg shadow-slate-500/100  max-w-4xl">
        <p className="mt-4 text-center text-xl tracking-wider">Welcome, Let us know about the pet you are donating</p>
        <form
          className="flex h-fit w-full flex-row flex-wrap justify-around rounded-md px-5 py-10 md:px-10 md:py-16"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={onSubmit}
        >
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                What type of pet are you donating?
              </span>
            </label>
            <select className="select-bordered  select" {...register("type")}>
              <option value="">Select pet type</option>
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
              <option value="BIRD">Bird</option>
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="type"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control  w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                {" "}
            What is the name of the pet?
              </span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Pet Name"
              className="input-bordered input-primary input w-full max-w-xs"
            />
            <ErrorMessage errors={errors} name="breed" as="h5"  className="text-red-600"/>
          </div>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">What gender is the gender of the Pet?</span>
            </label>
            <select className="select-bordered  select" {...register("gender")}>
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
             
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="gender"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control  w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                {" "}
            What is the breed of the pet?
              </span>
            </label>
            <input
              {...register("breed")}
              type="text"
              placeholder="Pet Breed"
              className="input-bordered input-primary input w-full max-w-xs"
            />
            <ErrorMessage errors={errors} name="breed" as="h5"  className="text-red-600"/>
          </div>
          
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
               How old should is the pet?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("ageRange")}
            >
              <option value="">Select pet</option>
              <option value="BELOW_ONE">below 1 year</option>
              <option value="ONE_TO_TWO">1-2 years</option>
              <option value="TWO-TOFIVE">2-5 years</option>
              <option value="OVERFIVE">Over 5 years</option>
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="ageRange"
              as="h5"
              className="text-red-600"
            />
          </div>
    
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
            Which animal does your pet dislike or threaten?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("petTorrelance")}
            >
              <option value="">Select pet</option>
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
              <option value="BIRD">bird</option>
              <option value="ALL">All the above</option>
              <option value="NONE">I currently dont own a pet</option>
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="petTorrelance"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
               Is the pet well socialized with kids below 8 years?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("children")}
            >
              <option value="">Children below 8 years</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
          
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="children"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control w-full max-w-xs mt-8">
            <label className="label">
              <span className="label-text">
               Is the pet neutered/spayed?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("neutered")}
            >
              <option value="">Health: neutered? </option>
              <option value="true">Yes</option>
              <option value="false">No</option>
          
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="neutered"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                Does the pet need access to a private garden?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("garden")}
            >
              <option value="">Access to garden</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
          
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="garden"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
               Is the pet highly active or chilled?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("active")}
            >
              <option value="">How active</option>
              <option value="true">Yes, we will be going for runs</option>
              <option value="false">No, just walks</option>
          
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="active"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control w-full max-w-xs ">
              <label className="label">
                <span className="label-text">Pet Description?</span>
              </label>
              <textarea
                className="textarea-bordered  textarea h-28"
                placeholder="Pet Bio"
                id="description"
                {...register("description")}
              ></textarea>
              <label className="label">
                {/* errors */}
                <ErrorMessage
                  errors={errors}
                  name="description"
                  as="h5"
                  className="text-red-600"
                />
              </label>
            </div>
     
            <div className="form-control w-full max-w-xs ">
              <label className="label">
                <span className="label-text">Attach any project files</span>
              </label>

              <Controller
                control={control}
                name="images"
                render={({ field: { onBlur } }) => (
                  <Dropzone field={field} onBlur={onBlur} />
                )}
              />

              <label className="label">
                {/* errors */}
                <ErrorMessage
                  errors={errors}
                  name="images"
                  as="h5"
                  className="text-red-600"
                />
              </label>
            </div>
          {isLoading ? (
                <div className="form-control  w-full max-w-xs mt-5">
            <LoadingButton />
            </div>
          ) : (
            <div className="form-control  w-full max-w-xs mt-5">
              <button
                type="submit"
                className="btn-primary btn my-5 w-full max-w-xs"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
    </>
  );
};
export default PetOnboarding;
