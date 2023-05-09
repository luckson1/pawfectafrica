import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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
const adopterSchema = z.object({
    breed: z.string().min(1, { message: 'Breed Required' }),
  ageRange: z.nativeEnum(Age, {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  gender: z.nativeEnum(Gender, {errorMap: ()=> {return {message: "Please select one of the options"}}} ).optional(),
  type: z.nativeEnum(Type,{errorMap: ()=> {return {message: "Please select one of the options"}}} ),
  children: z.enum(['true', 'false'], {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  garden: z.enum(['true', 'false'], {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  active: z.enum(['true', 'false'], {errorMap: ()=> {return {message: "Please select one of the options"}}}),
  currentPet: z.nativeEnum(CurrentPet, {errorMap: ()=> {return {message: "Please select one of the options"}}}),
});

type Values = z.infer<typeof adopterSchema>;
const Onboarding = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(adopterSchema),
  });
  const { data, status } = useSession();

  const userRole = data?.user?.role;
  const isOnboarded = userRole === "ADOPTER";
  const isLoadingStatus = status === "loading";
  const isUnAthorised = status === "unauthenticated";
  const router = useRouter();
  useEffect(() => {
    if (isOnboarded) router.push("/dashboard");
  }, [isOnboarded, router]);

  const { mutate: onboarding, isLoading } = api.user.onboarding.useMutation({
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
        <p className="mt-4 text-center text-2xl tracking-wider">Welcome, Let us discover the most suitable pet for You</p>
        <form
          className="flex h-fit w-full flex-row flex-wrap justify-around rounded-md px-5 py-10 md:px-10 md:py-16"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={onSubmit}
        >
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                What type of pet are you looking for?
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
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">What gender do you prefer?</span>
            </label>
            <select className="select-bordered  select" {...register("gender")}>
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NA">Any</option>
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
                Do you have any pet Breed in mind?
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
               How old should the pet be?
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
                What pet do you currently have at home?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("currentPet")}
            >
              <option value="">Select pet</option>
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
              <option value="BIRD">bird</option>
              <option value="NONE">I currently dont own a pet</option>
              <option value="ALL">All the above</option>
            </select>
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="currentPet"
              as="h5"
              className="text-red-600"
            />
          </div>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                Do you have kids below 8 years?
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
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                Do you have access to a private garden?
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
                Is the pet expected to do straineous excercises?
              </span>
            </label>
            <select
              className="select-bordered  select"
              {...register("active")}
            >
              <option value="">How Active</option>
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
export default Onboarding;
