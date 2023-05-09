

import React, { useEffect, useState } from "react";








import { toast, Toaster } from "react-hot-toast";
import { Nav } from "~/components/Nav";
import { api } from "~/utils/api";
import LoadingSkeleton from "~/components/loading/LoadingSkeletons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic'
import TinderCard from "react-tinder-card";




const DashboardComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [lastDirection, setLastDirection] = useState<string>();
  const [removedPet, setRemovedPet] = useState<string>('');
  const [selectedPet, setSelectedPet] = useState<string>();
  const[ displayedPets, setDisplayedPets]=useState()

const router=useRouter()

const {data: pets, isError, error, isLoading}=api.pet.getAllPets.useQuery()




const { data, status } = useSession();

const userRole = data?.user?.role;
const isOnboarded = userRole === "ADOPTER";
const isLoadingStatus = status === "loading";
const isUnAthorised = status === "unauthenticated";


useEffect(() => {
  if (isOnboarded) router.push("/dashboard");
}, [isOnboarded, router]);
    useEffect(()=> {
      if (isError){toast.error( `${error.message}`, {duration: 6000})}
     
      }, [error, isError])
  let showInfo = "";
  const outOfFrame = function (name:string) {
    setRemovedPet(name);
  };
  const swiped = function (direction:string, id:string) {
    setLastDirection(direction);
  



    // call action to update matches when one swipes right
    if (direction === "right") {
    //   return dispatch(updateMatchesAction(pet));
    } return
  };

  const showInfoFunc = () => {
    showInfo =
      lastDirection === "right"
        ? `${removedPet} +  was added to favourites`
        : lastDirection === "left"
        ? removedPet + " left the screen"
        : lastDirection === "up"
        ? removedPet + " left the screen"
        : lastDirection === "down"
        ? removedPet + " left the screen"
        : "";
    return showInfo;
  }; // fetch prefered pets
  const swipeAction= showInfoFunc();
 
  return (
    <>
      <Nav  />
    
      <div className="md:mx-20 mt-16 ">
      <Toaster
      position="top-right"
      reverseOrder={false} />
        
  {  !showModal &&    <div className="w-11/12 fixed justify-center text-xs md:text-lg">
          {/* {!isAdmin && !isOnboarded && !petLoading &&  (
            <p>
              Please complete the{" "}
              <a href="/onboarding" className="text-blue-500">
                registration process
               
              </a>
            </p>
          )} */}
          <div className=" -mt-12 text-center">
            {removedPet && swipeAction}
          </div>
        </div>}
    
      
   
        {isLoading && (
          <LoadingSkeleton />
        ) }
          {!showModal && pets?.map((pet) => (
            <TinderCard
              className="swipe"
              key={pet.id}
              onSwipe={(dir) => swiped(dir, pet.id)}
              onCardLeftScreen={() => outOfFrame(pet.name)}
            >
              <div className="dashboard">
                <div className="pet-header-small-screen">
                 {pet?.name !=="Last Card" && <button
                    className=" btn btn-primary  shadow focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                      setShowModal(true);
                      setSelectedPet(pet.id)
                    }}
                    onTouchStart={() => {
                      setShowModal(true);
                      setSelectedPet(pet.id)
                    }}
                  >
                  View {pet?.name}&apos;s Profile
                  </button>}
                  {pet?.name ==="Last Card" && <button
                    className=" btn btn-primary  shadow focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                  router.push("/favourite-pets")
                    }}
                    onTouchStart={() => {
                      router.push("/favourite-pets")
                    }}
                  >
                   Favourites
                  </button>}
                </div>
             
     
                <div className="swiper-container">
                  <div className="card-container" key={pet.id}>
                    <div
                      style={{ backgroundImage: `url(${pet.Image.at(0)?.url ?? ""})` }}
                      className="card bg-contain"
                    >
                     {pet?.name=== "Last Card"? <h2>Congratulations! You&apos;re all caught up! <Link href="/favourite-pets" className="text-blue-500 underline" onTouchStart={()=> router.push("/favourite-pets")}>View your favourite pets</Link></h2>: <h3>{pet.name}</h3>}
                    </div>
                  </div>
                  
                </div>
                
              </div>
              
            </TinderCard>
          ))}
        
        </div>
    
    </>
  );
};

export default DashboardComponent