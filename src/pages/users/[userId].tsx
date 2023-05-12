import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import LoadingSkeleton from '~/components/loading/LoadingSkeletons';
import { api } from '~/utils/api';

function UserId() {
    
    enum DisplayTypes {
        BIO = "BIO",
        PREFERENCES="PREFERENCES"
      }
      const [display, setDisplay] = useState(DisplayTypes.BIO);
      const params=useSearchParams()
      const userId= params.get("id") ?? "";
      console.log(params.getAll('id'))
      const {data:user, isLoading, isError, error}=api.user.getUser.useQuery({userId})
      const preference=user?.Preference.at(0)
      if (isError && !isLoading) {
        return (
          <div className="flex h-full w-full flex-col">
            <div className="h-1/2 w-full">
              <img src="/error.svg" alt="Pet" />
            </div>
            <h2 className="text-6xl text-red-500">
              Something Wrong Occured : {error?.message}
            </h2>
          </div>
        );
      }
      if (!user && !isLoading) {
        return (
          <div className="flex h-full w-full flex-col">
            <div className="h-1/2 w-full">
              <img src="/error.svg" alt="Pet" />
            </div>
            <h2 className="text-6xl text-red-500">Something Wrong Occured </h2>
          </div>
        );
      }
    
      if (isLoading) {
        return (
          <div className="flex h-full w-full items-center justify-center  ">
            {" "}
            <LoadingSkeleton />
          </div>
        );
      }
  return (
   <div className='w-screen h-fit min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center my-10'>
  <Image
                          alt={user.name ?? "Profile Pic"}
                          src={
                            user.image ??
                            "https://randomuser.me/api/portraits/lego/5.jpg"
                          }
                          className="h-60 w-60 rounded-full"
                          width={500}
                          height={500}
                        />

<div className="mx-auto my-10 flex h-fit w-[90%] flex-col  justify-start  gap-5 ">
          <div className="tabs w-full">
            <button
              onClick={() => setDisplay(DisplayTypes.BIO)}
              className={`tab-lifted tab ${
                display === DisplayTypes.BIO ? "tab-active" : ""
              }`}
            >
              Bio
            </button>
            <button
              onClick={() => setDisplay(DisplayTypes.PREFERENCES)}
              className={`tab-lifted tab ${
                display === DisplayTypes.PREFERENCES ? "tab-active" : ""
              }`}
            >
              Donor
            </button>
         
          </div>
          {display === DisplayTypes.BIO && (
            <div className=" flex flex-col gap-5">
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Name: </p>

                <p> {user.name}</p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Email: </p>

                <p> {user.email} </p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Type of Account: </p>

                <p> {user.role} </p>
              </div>
             
            </div>
          )}
          {display === DisplayTypes.PREFERENCES && preference && (
            <div className=" flex flex-col gap-5">
            <div className="mt-2 flex flex-row gap-5">
              <p className="h2 text-lg font-bold"> I am looking for a  :</p>

              <p> {preference.type}</p>
            </div>
            <div className="mt-2 flex flex-row gap-5">
              <p className="h2 text-lg font-bold"> Age Range: </p>

              <p> {preference.ageRange} Years</p>
            </div>
            <div className="mt-2 flex flex-row gap-5">
              <p className="h2 text-lg font-bold"> Breed: </p>

              <p> {preference.breed}</p>
            </div>
            <div className="mt-2 flex flex-row gap-5">
              <p className="h2 text-lg font-bold"> Gender: </p>

              <p> {preference.gender}</p>
            </div>

            <div className="mt-2 flex flex-row gap-5">
              <p className="h2 text-lg font-bold">
                {" "}
             Garden: 
              </p>

              <p>
                {" "}
                {preference.isActive
                  ? "I have access to a private garden"
                  : "I dont have access to a private garden"}
              </p>
            </div>
            <div className="mt-2 flex flex-row gap-5">
              <p className="h2 text-lg font-bold"> Kids: </p>

              <p>
                {" "}
                {preference.hasChildren
                  ? "I have kids below 10 years"
                  : "I do not have kids below 10 years"}
              </p>
            </div>
            <div className="mt-2 flex flex-row gap-5">
              <p className="h2 text-lg font-bold">
                {" "}
                I have another pet:{" "}
              </p>

              <p>
                {" "}
                {preference.currentPet === "BIRD"
                  ? "A Bird"
                  : preference.currentPet === "CAT"
                  ? "A Cat"
                  : preference.currentPet === "DOG"
                  ? "A Dog"
                  : preference.currentPet === "NONE"
                  ? "None"
                  : "None"}
              </p>
            </div>
          
          </div>
          )}

          
        </div>
   </div>
  )
}

export default UserId