import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from 'react-select';
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import { api } from "~/utils/api";
import LoadingButton from "~/components/loading/LoadingButton";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";


const PetSchema = z.object({
  name: z.string().min(1, { message: "Name Required" }),
  description: z.string().min(10, { message: "Description too short" }),
  idealHome: z.string().min(10, { message: 'idealHome too short' }),
  background: z.string().min(10, { message: "backround too short" }),
  neutered: z.enum(["true", "false"], {
    errorMap: () => {
      return { message: "Please select one of the options" };
    },
  }),
  breed: z.string().min(1, { message: "Breed Required" }).nullable(),
  ageRange: z.enum(["BELOW_ONE", "ONE_TO_TWO", "TWO_TO_FIVE", "OVER_FIVE"], {
    errorMap: () => {
      return { message: "Please select one of the options" };
    },
  }),
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
  torrelance: z
    .array(
      z.object({
        value: z.enum(["NONE", "CAT", "DOG", "BIRD", "ALL"]),
        label: z.string(),
      }),
      {
        errorMap: () => {
          return { message: "Please select one of the options" };
        },
      }
    )
   
});
// const  tt=z.array(
//   z.object({
//     value: z.enum(["NONE", "CAT", "DOG", "BIRD", "ALL"]),
//     label: z.string(),
//   }))
// type t=z.infer<typeof tt>
export type PetValues = z.infer<typeof PetSchema>;
const PetOnboarding = () => {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const options : PetValues['torrelance'] = [
    { value: "DOG", label: "Dogs" },
    { value: "CAT", label: "Cats" },
    { value: "BIRD", label: "Birds" },
    { value: "NONE", label: "Not socialized to other pet" },
  ];
  const { data: pet } = api.pet.getOnePet.useQuery({ id }, {
    onSuccess: (pet)=> {
    const t=pet.petTorrelance === "ALL"
    ? [options[0]!, options[1]!, options[2]!]
    : pet.petTorrelance === "NONE"
    ? [options[3]!]
    : pet.petTorrelance === "DOG"
    ? [options[0]!]
    : pet.petTorrelance === "CAT"
    ? [options[1]!]
    : pet.petTorrelance === "BIRD"
    ? [options[2]!]
    : pet.petTorrelance === "DOG_CAT"
    ? [options[0]!, options[1]!]
    : pet.petTorrelance === "DOG_BIRD"
    ? [options[0]!, options[2]!]
    : pet.petTorrelance === "CAT_BIRD"
    ? [options[1]!, options[2]!]
    : [options[3]!]
setValue('torrelance', t)
    }
  });

  const {
    register,
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PetValues>({
    resolver: zodResolver(PetSchema),
    defaultValues: {
      name: pet?.name,
      description: pet?.description,
      background: pet?.background,
      idealHome: pet?.idealHome,
      neutered: pet?.isNeutered ? "true" : "false",
      breed: pet?.breed,
      ageRange: pet?.ageRange,
      gender: pet?.gender,
      type: pet?.type,
      children: pet?.isChildrenSafe ? "true" : "false",
      garden: pet?.isNeedGarden ? "true" : "false",
      active: pet?.isActive ? "true" : "false",
 
        
    },
  });
  const { data } = useSession();
  const userRole = data?.user?.role;
  const isOnboarded = userRole === "DONOR" || userRole === "ADMIN";
const ll=watch('torrelance')
  const router = useRouter();
  useEffect(() => {
    if (!isOnboarded) router.push("/donorOnboarding");
  }, [isOnboarded, router]);

  const { mutate: edit, isLoading } = api.pet.updatePetProfile.useMutation({
    onSuccess: (pet) => router.push(`/pets/id?id=${pet.id}`),
  });

  const onSubmit = handleSubmit((data) => {
    edit({ id, ...data });
  });

  return (
    <>
      <div className="max-full mb-2  mt-0 flex w-full items-center justify-center rounded-md bg-base-100  md:mt-16">
        <Toaster position="top-right" reverseOrder={true} />
        <div className="flex h-fit w-full max-w-4xl flex-col rounded-md bg-base-100 bg-opacity-40 shadow-lg  shadow-base-300/100">
          <p className="mt-4 text-center text-xl tracking-wider">
            Welcome, Let us know about the pet you are rehoming
          </p>
          <form
            className="flex h-fit w-full flex-row flex-wrap justify-around rounded-md px-5 py-10 md:px-10 md:py-16"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={onSubmit}
          >
            <div className="form-control mt-5 w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  What type of pet are you rehoming?
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
            <div className="form-control  mt-5 w-full max-w-xs">
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
              <ErrorMessage
                errors={errors}
                name="breed"
                as="h5"
                className="text-red-600"
              />
            </div>
            <div className="form-control mt-5 w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  What gender is the gender of the Pet?
                </span>
              </label>
              <select
                className="select-bordered  select"
                {...register("gender")}
              >
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
            <div className="form-control  mt-5 w-full max-w-xs">
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
              <ErrorMessage
                errors={errors}
                name="breed"
                as="h5"
                className="text-red-600"
              />
            </div>

            <div className="form-control mt-5 w-full max-w-xs">
              <label className="label">
                <span className="label-text">How old is the pet?</span>
              </label>
              <select
                className="select-bordered  select"
                {...register("ageRange")}
              >
                <option value="">Select pet age</option>
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
              Which animals is your pet  socialised with? 
              </span>
            </label>
            <Controller
        name="torrelance"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
          
            isMulti
            className="w-full max-w-xs"
            classNamePrefix="py-0.5 border-slate-100"
            value={field.value}
            options={[
              { value: 'DOG', label: 'Dogs' },
              { value: 'CAT', label: 'Cats' },
              { value: 'BIRD', label: 'Birds' },
              { value: 'NONE', label: 'Not socialized to other pet' },
            ]}
          />
        )}
      />
           
          
            <label className="label"></label>
            <ErrorMessage
              errors={errors}
              name="torrelance"
              as="h5"
              className="text-red-600"
            />
          </div>
            <div className="form-control mt-5 w-full max-w-xs">
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
            <div className="form-control mt-8 w-full max-w-xs">
              <label className="label">
                <span className="label-text">Is the pet neutered/spayed?</span>
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
            <div className="form-control mt-5 w-full max-w-xs">
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
            <div className="form-control mt-5 w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  Is the pet highly active or chilled?
                </span>
              </label>
              <select
                className="select-bordered  select"
                {...register("active")}
              >
                <option value="">How active is the pet</option>
                <option value="true">Very active</option>
                <option value="false">Not so active</option>
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
                <span className="label-text">Pet Character?</span>
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
                <span className="label-text">Pet Background?</span>
              </label>
              <textarea
                className="textarea-bordered  textarea h-28"
                placeholder="Pet background"
                id="background"
                {...register("background")}
              ></textarea>
              <label className="label">
                {/* errors */}
                <ErrorMessage
                  errors={errors}
                  name="background"
                  as="h5"
                  className="text-red-600"
                />
              </label>
            </div>
            <div className="form-control w-full max-w-xs ">
              <label className="label">
                <span className="label-text">Pet Ideal Home?</span>
              </label>
              <textarea
                className="textarea-bordered  textarea h-28"
                placeholder="Pet ideal home"
                id="idealHome"
                {...register("idealHome")}
              ></textarea>
              <label className="label">
                {/* errors */}
                <ErrorMessage
                  errors={errors}
                  name="idealHome"
                  as="h5"
                  className="text-red-600"
                />
              </label>
            </div>
            {isLoading ? (
              <div className="form-control  mt-5 w-full max-w-xs">
                <LoadingButton />
              </div>
            ) : (
              <div className="form-control  mt-5 w-full max-w-xs">
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
