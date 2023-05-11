import React, { useEffect, useState } from "react";

import { toast, Toaster } from "react-hot-toast";
import { api } from "~/utils/api";
import LoadingSkeleton from "~/components/loading/LoadingSkeletons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TinderCard from "react-tinder-card";

const Pets = () => {
  
  const [lastDirection, setLastDirection] = useState<string>();
  const [removedPet, setRemovedPet] = useState<string>("");


  const router = useRouter();

  const {
    data: pets,
    isError,
    error,
    isLoading,
  } = api.pet.getAllPets.useQuery();
const {mutate:addToFavourites}=api.user.addToFavourites.useMutation()
  const { data} = useSession();

  const userRole = data?.user?.role;
  const isOnboarded = userRole === "ADOPTER" ||  userRole === "DONOR" ||  userRole === "ADMIN"
  

  useEffect(() => {
    if (!isOnboarded) router.push("/onboarding");
  }, [isOnboarded, router]);
  useEffect(() => {
    if (isError) {
      toast.error(`${error.message}`, { duration: 6000 });
    }
  }, [error, isError]);

  const outOfFrame = function (name: string) {
    setRemovedPet(name);
  };
  const swiped = function (direction: string, id: string) {
    setLastDirection(direction);

    // call action to update matches when one swipes right
    if (direction === "right") {

addToFavourites({id})
    }
    return;
  };


    const showInfo =
      lastDirection === "right"
        ? `${removedPet}  was added to your favourite list`
        : lastDirection === "left"
        ? removedPet + " left the screen"
        : lastDirection === "up"
        ? removedPet + " left the screen"
        : lastDirection === "down"
        ? removedPet + " left the screen"
        : "";
        if(isError  && !isLoading) {
          return <div className="w-full h-full flex flex-col">
            <div className="w-full h-1/2">
      
      <img src="/error.svg" alt="Pet"/>
            </div>
      <h2 className="text-red-500 text-6xl">Something Wrong Occured : {error?.message}</h2>
      
          </div>
        }
        if(!pets && !isLoading) {
          return <div className="w-full h-full flex flex-col">
            <div className="w-full h-1/2">
      
      <img src="/error.svg" alt="Pet"/>
            </div>
      <h2 className="text-red-500 text-6xl">Something Wrong Occured </h2>
      
          </div>
        }
        if(pets && pets.length<=0) {
          return <div className="w-full h-full flex flex-col">
            <div className="w-full h-1/2">
      
      <img src="/pet.svg" alt="Pet"/>
            </div>
      <h2 className="text-6xl">No Pets Found</h2>
      
          </div>
        }
  
  if(isLoading) {
    return(
      <div className="flex h-full w-full items-center justify-center  ">
      {" "}
      <LoadingSkeleton />
    </div>
    )
  }

  return (
    <div className="h-fit w-full flex flex-col  gap-y-5  ">
      <Toaster position="top-right" reverseOrder={false} />

   
          <div className="flex w-full flex-col my-5 gap-y-2 ">
          <p className="mx-5 text-center">
             This is a pet you could adopt? Swipe the card right.
          </p>
          {/* <p className="mx-5 text-center text-xl font-bold">Else</p> */}
          <p className="mx-5 text-center">
            Swipe left to remove the pet from the dashboard
          </p>
        {  removedPet && <p className="mx-5 text-center text-primary font-bold">
           {showInfo}
          </p>}

        </div>
      <div className="mx-auto flex h-[36rem] w-full max-w-xl flex-col mb-10">
    
        {pets?.map((pet) => (
          <TinderCard
            className=" absolute  h-[36rem] w-full max-w-xl"
            key={pet.id}
            onSwipe={(dir) => swiped(dir, pet.id)}
            onCardLeftScreen={() => outOfFrame(pet.name)}
          >
            <div className=" flex w-full h-full flex-row flex-wrap">
              <div className=" h-full w-full ">
                <div className="h-full w-full" key={pet.id}>
                  <div
                    style={{
                      backgroundImage: `url(${pet.Image.at(0)?.url ?? ""})`,
                    }}
                    className="card flex h-full w-full items-center justify-end bg-contain bg-no-repeat py-10 shadow-2xl shadow-secondary/100"
                  >
                    <button className="btn btn-secondary w-full max-w-xs" onClick={()=>router.push(`/pets/id?id=${pet.id}`)} onTouchStart={()=>router.push(`/pet?id=${pet.id}`)}>
                      Visit {pet.name}&apos;s Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default Pets;
