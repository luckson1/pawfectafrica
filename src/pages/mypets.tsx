import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/navigation";
import React, { useState } from 'react'
import LoadingSkeleton from "~/components/loading/LoadingSkeletons";
import { api } from "~/utils/api";
enum ViewState {
  Favorites = "Favorites",
  Adoptions = "Adoptions",
  Donations = "Donations",
}
const Tab = ({
  view,
  setView,
}: {
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
}) => {
  const [animationParent] = useAutoAnimate();
  return (
    <div
      className="mx-auto flex h-fit w-full max-w-xl flex-row items-center justify-between rounded-lg bg-base-200 p-1 text-xs"
      ref={animationParent}
    >
      {view === "Favorites" ? (
        <button
          className="btn-sm btn w-1/4 text-xs capitalize"
          onClick={() => setView(ViewState.Favorites)}
        >
          My Favorites
        </button>
      ) : (
        <p
          className="flex w-1/4 cursor-pointer items-center justify-center"
          onClick={() => setView(ViewState.Favorites)}
        >
          My Favorites
        </p>
      )}

      {view === "Adoptions" ? (
        <button
          className="btn-sm btn w-1/4 text-xs capitalize"
          onClick={() => setView(ViewState.Adoptions)}
        >
         Pets I adopted
        </button>
      ) : (
        <p
          className="flex w-1/4 cursor-pointer items-center justify-center"
          onClick={() => setView(ViewState.Adoptions)}
        >
         Pets I adopted
        </p>
      )}

      {view === "Donations" ? (
        <button
          className="btn-sm btn w-1/4 text-xs capitalize"
          onClick={() => setView(ViewState.Donations)}
        >
       Pets i donated
        </button>
      ) : (
        <p
          className="flex w-1/4 cursor-pointer items-center justify-center"
          onClick={() => setView(ViewState.Donations)}
        >
         Pets I donated
        </p>
      )}
    </div>
  );
};



 
 function FavPetLoader() {
  const {data:pets, isLoading, isError, error}=api.pet.getUserFavouritePets.useQuery()
  const skeletonData = Array.from({ length: 6 });
  const router=useRouter()
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
   return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3 justify-center items-center w-full h-full min-h-[50vh]">
          {isLoading ? (
        skeletonData.map((item, index) => (
          <LoadingSkeleton key={index} />
        ))
          ) : (
            pets?.map((pet) => (
         
              <div className="card w-full max-w-sm glass"   key={pet?.id}>
              <figure>  <img
                  src={pet?.Image.at(0)?.url ?? ""}
                  alt={pet?.name}
              
                
              
                /></figure>
              <div className="card-body">
                <h2 className="text-xl text-center">{pet?.name}</h2>
                <button className="btn btn-secondary"    onClick={() => {
      router.push(`/pets/id?id=${pet.id}`);
         
          }}>View Profile</button>
               
              </div>
            </div>
            ))
          )}
        </div>
   )
 }

 function AdoptedPetLoader() {
  const {data:pets, isLoading, isError, error}=api.pet.getUserAdoptedPets.useQuery()
  const skeletonData = Array.from({ length: 6 });
  const router=useRouter()
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
   return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3 justify-center items-center w-full h-full min-h-[50vh]">
          {isLoading ? (
        skeletonData.map((item, index) => (
          <LoadingSkeleton key={index} />
        ))
          ) : (
            pets?.map((pet) => (
         
              <div className="card w-full max-w-sm glass"   key={pet?.id}>
              <figure>  <img
                  src={pet?.Image.at(0)?.url ?? ""}
                  alt={pet?.name}
              
                
              
                /></figure>
              <div className="card-body">
                <h2 className="text-xl text-center">{pet?.name}</h2>
                <button className="btn btn-secondary"    onClick={() => {
      router.push(`/pets/id?id=${pet.id}`);
         
          }}>View Profile</button>
               
              </div>
            </div>
            ))
          )}
        </div>
   )
 }

 function DonatedPetLoader() {
  const {data:pets, isLoading, isError, error}=api.pet.getUserDonatedPets.useQuery()
  const skeletonData = Array.from({ length: 6 });
  const router=useRouter()
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
   return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3 justify-center items-center w-full h-full min-h-[50vh]">
          {isLoading || !pets || pets.length<=0? (
        skeletonData.map((item, index) => (
          <LoadingSkeleton key={index} />
        ))
          ) : (
            pets?.map((pet) => (
         
              <div className="card w-full max-w-sm glass"   key={pet?.id}>
              <figure>  <img
                  src={pet?.Image.at(0)?.url ?? ""}
                  alt={pet?.name}
              
                
              
                /></figure>
              <div className="card-body">
                <h2 className="text-xl text-center">{pet?.name}</h2>
                <button className="btn btn-secondary"    onClick={() => {
      router.push(`/pets/id?id=${pet.id}`);
         
          }}>View Profile</button>
               
              </div>
            </div>
            ))
          )}
        </div>
   )
 }
 
 export default function Mypets() {
  const [view, setView] = useState(ViewState.Favorites);
  const [animationParent] = useAutoAnimate();
  return (
  <>

   <div className="flex flex-col w-screen h-[100vh-4rem] bg-base-100 p-10 md:p-20 justify-center items-center">
    <Tab view={view} setView={setView}/>

<div className="flex w-full h-full justify-center items-center my-10" ref={animationParent}>
  {view==="Favorites" && <FavPetLoader />}
  {view==="Adoptions" && <AdoptedPetLoader />}
  {view==="Donations" && <DonatedPetLoader />}

</div>
   </div>
  </>
  )
}

