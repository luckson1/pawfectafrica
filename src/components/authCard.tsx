
import React from "react";
import { signIn, } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import {  useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
const handleLogin= () =>  signIn("google", { callbackUrl: "/pets" })

export const LoginCard = () => {
  const emailSchema=z.object({email: z.string().email({message: "Enter a Valid Email!"}).nonempty("Email Required!"),})
  type Value=z.infer<typeof emailSchema>
  const {register,   handleSubmit,
        

     formState: { errors }, }= useForm<Value>({
      resolver: zodResolver(emailSchema),
    });

  return (
    <div className="items-center   flex h-full w-full max-w-4xl max-h-[56rem] card  flex-col-reverse md:flex-row justify-center items center  rounded-2xl   shadow-2xl  ">
      <div className="h-2/5 md:h-full w-full md:w-1/2 bg-accent p-5 rounded-br-xl rounded-bl-xl md:rounded-br-none md:rounded-tl-xl" > <Image src="/adopt.svg" height={600} width={600} className="w-full h-full"  alt="adopt a pet"/> </div>
      <section className="  flex flex-col p-4 gap-2 justify-center items-center h-3/5 md:h-full w-full md:w-1/2 bg-base-100 rounded-tr-xl rounded-tl-xl md:rounded-tl-none md:rounded-br-xl">
   
          <p className=" tracking-wider text-center font-bold text-lg">Continue With:</p>
     

        <div className="flex flex-col w-full justify-center items-center gap-2">
       <div className="flex flex-col gap-2 w-full justify-center items-center">
        <p>   Google</p>
        <button
          /* eslint-disable-next-line @typescript-eslint/no-misused-promises */ 
            onClick={handleLogin}
            className=" btn btn-primary btn-outline w-full max-w-xs gap-2 "
          >
             <FcGoogle className="h-6 w-6" />
            <p className="tracking-[5px]">Google </p>
           
          </button>
       </div>
      
          
       <p className="tracking-wider font-bold text-lg mt-3">Or</p> 

        <form className=" flex flex-col w-full justify-center items-center" 
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(data=> signIn("email", {email: data.email, callbackUrl: "/pets"}))}>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-center">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email"
            className="input-bordered input-primary input w-full max-w-xs"
            {...register("email")}

          />
             <label className="label">
            {/* errors */}
            <ErrorMessage
              errors={errors}
              name="email"
              as="h5"
              className="text-red-600"
            />
          </label>
        </div>
          <button className="btn btn-primary w-full max-w-xs gap-2"> <MdOutlineEmail className="w-6 h-6"/>   <p className="tracking-[5px]">Email </p></button>

        </form>
        </div>
      </section>
    </div>
  );
};
