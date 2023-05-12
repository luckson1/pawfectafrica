import React from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import LoadingSkeleton from "./loading/LoadingSkeletons";
import { useRouter } from "next/navigation";
import TableLoading from "./loading/TableLoading";

function PetsTable() {
  const { data: pets, isLoading, isError, error } = api.pet.getAllPets.useQuery();
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
<h2 className="text-6xl">No pets Found</h2>

    </div>
  }
  if (isLoading) return <div className="w-full h-full min-h-[40vh]"> <TableLoading /></div>
  return (
    <div className="table text-left w-full">
      <ul className="responsive-table">
      <li className="table-header md:rounded-md rounded-xl   my-5 md:my-2 bg-base-300">
          <div className="col col-1 text-left">Avatar</div>
          <div className="col col-1 text-left">Name</div>
          <div className="col col-1 text-left">Donor</div>
          <div className="col col-1 text-left">Type</div>
          <div className="col col-1 text-left">Gender</div>
          <div className="col col-1 text-left">Adopter </div>
        </li>

        {pets?.map((pet) => (
            <li className="table-row md:rounded-md rounded-xl   my-5 md:my-2 bg-base-100" key={pet.id}>
            <div className="col col-1" data-label="Avatar">
              <Image
                alt={pet.name ?? "Profile Pic"}
                src={
                  pet?.Image.at(0)?.url ?? ""
                }
                className="ml-5 h-6 w-6 rounded-full cursor-pointer"
                height={40}
                width={40}
               
                        
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                onClick={()=> router.push(`/pets/id?id=${pet.id}`)}
              />
            </div>
            <div className="col col-1 text-left" data-label="Name">
              {pet?.name}
            </div>
            
            <div className="col col-1 text-left" data-label="Email">
            <Image
                alt={pet.name ?? "Profile Pic"}
                src={
                  pet?.donor.image ?? "https://randomuser.me/api/portraits/lego/5.jpg"
                }
                className="ml-5 h-6 w-6 rounded-full cursor-pointer"
                height={40}
                width={40}
                onClick={()=> router.push(`/users/id?id=${pet.donor.id}`)}
              />
            </div>

            <div className="col col-1 text-left" data-label="Name">
              {pet?.type}
            </div>
            <div className="col col-1 text-left" data-label="Name">
              {pet?.gender}
            </div>
            <div className="col col-1" data-label="Pets Adopted">
              <div className="flex gap-1">
                {" "}
                {pet?.Adoption.length <= 0
                  ? "Not Adopted"
                  :  pet.Adoption.map(pet=> (
                    <Image
                      src={pet.user.image ?? "https://randomuser.me/api/portraits/lego/5.jpg"}
                      key={pet.user.id}
                      width={40}
                      height={40}
                      alt="pet"
                      className=" cursor-pointer h-6 w-6 rounded-full"
                        
                     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                     onClick={()=> router.push(`/users/id?id=${pet.user.id}`)}
                    />
                  ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PetsTable;
