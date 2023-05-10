import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import LoadingButton from '~/components/loading/LoadingButton';
import { api } from '~/utils/api';

function DonorOnboarding() {
    const DonorSchema= z.object({
        phoneNumber:z.string().regex(/^(\+254|0)[1-9]\d{8}$/),
        reason: z.string().min(10, {message: "too short"})
    })
type DonorValues=z.infer<typeof DonorSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<DonorValues>({
        resolver: zodResolver(DonorSchema),
      });
const router=useRouter()

      const {mutate: createProfile, isLoading, isError, error }=api.user.createDonorProfile.useMutation({onSuccess: ()=>router.push("/petOnboarding")})
  return (
    <div className='w-screen h-screen bg-base-100 flex justify-center items-center '>
        <div className='card shadow-xl shadow-primary/100 w-full max-w-md h-full max-h-[40rem] flex justify-center items-center flex-col p-7'>
<p className='text-xl'>Hi, Lets get the donation process started!</p>
<form className=' flex flex-col gap-y-10 card-body w-full justify-center items-center' 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
onSubmit={handleSubmit((data) => {createProfile(data)})}

>
<div className="form-control  w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">
                {" "}
            What your phoneNumber?
              </span>
            </label>
            <input
              {...register("phoneNumber")}
              type="tel"
              placeholder="+254723375534"
              className="input-bordered input-primary input w-full max-w-xs"
            />
            <ErrorMessage errors={errors} name="phoneNumber" as="h5"  className="text-red-600"/>
          </div>
          <div className="form-control w-full max-w-xs ">
              <label className="label">
                <span className="label-text">Reason for Adoption?</span>
              </label>
              <textarea
                className="textarea-bordered  textarea h-28"
                placeholder="Pet Bio"
                id="description"
                {...register("reason")}
              ></textarea>
              <label className="label">
                {/* errors */}
                <ErrorMessage
                  errors={errors}
                  name="reason"
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
  )
}

export default DonorOnboarding