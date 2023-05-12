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
  } = api.pet.getAllUnadoptedPets.useQuery();
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
  useEffect(() => {
    if (!isError && !isLoading) {
      toast("If you like a pet, swipe right to add it to your favourites. Swipe left to remove the pet from the dashboard" ,{ duration: 6000 });
    }
  }, [isError, isLoading]);

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
    <div className="h-full w-full flex flex-col  ">
      <Toaster position="top-right" reverseOrder={false} />

   

          
      <div className="h-6 w-full my-2">
      {  removedPet && <p className="mx-2 text-center text-primary font-bold">
           {showInfo}
          </p>}
      </div>


      <div className="mx-auto flex h-[36rem] w-full max-w-xl flex-col mb-10 justify-center items-center shadow-2xl rounded-xl shadow-secondary/100">
   <div  className="flex gap-3 flex-col justify-center items-center w-full">  <p className="text-xl  ">You are all caught up. View your favorite pets</p> <button className="pressable btn btn-secondary w-full max-w-xs" onClick={()=> router.push("/mypets")}>Favorite Pets</button></div>
        {pets?.map((pet) => (
          <TinderCard
            className=" absolute  h-[36rem] w-full max-w-xl "
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
                    className="card flex h-full w-full items-center justify-end bg-contain bg-accent bg-no-repeat py-10 shadow-2xl shadow-primary/100"
                  >
                    <button className="btn btn-primary w-full max-w-xs pressable" onClick={()=>router.push(`/pets/id?id=${pet.id}`)} onTouchStart={()=>router.push(`/pets?id=${pet.id}`)}>
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
