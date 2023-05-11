import React from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TableLoading from "./loading/TableLoading";

function AdoptersTable() {
  const { data: users, isLoading, isError, error} = api.user.getAllAdopters.useQuery();
  const router=useRouter()
  if(isError  && !isLoading) {
    return <div className="w-full h-full flex flex-col">
      <div className="w-full h-1/2">

<img src="/error.svg" alt="Pet"/>
      </div>
<h2 className="text-red-500 text-6xl">Something Wrong Occured : {error?.message}</h2>

    </div>
  }
  if(!users && !isLoading) {
    return <div className="w-full h-full flex flex-col">
      <div className="w-full h-1/2">

<img src="/error.svg" alt="Pet"/>
      </div>
<h2 className="text-red-500 text-6xl">Something Wrong Occured </h2>

    </div>
  }
  if(users && users.length<=0) {
    return <div className="w-full h-full flex flex-col">
      <div className="w-full h-1/2">

<img src="/pet.svg" alt="Pet"/>
      </div>
<h2 className="text-6xl">No users Found</h2>

    </div>
  }
  if (isLoading) return <div className="w-full h-full min-h-[40vh]"> <TableLoading /></div>
  return (
    <div className="table text-left w-full">
      <ul className="responsive-table">
        <li className="table-header md:rounded-md rounded-xl  my-5 md:my-2">
          <div className="col col-1 text-left">Avatar</div>
          <div className="col col-3 text-left">Name</div>
          <div className="col col-3 text-left">Email</div>
          <div className="col col-1 text-left">Pets Adopted</div>
          <div className="col col-1 text-left">Preference</div>
          <div className="col col-2 text-left"> Favorites</div>
        </li>

        {users?.map((user) => (
            <li className="table-row md:rounded-md rounded-xl   my-5 md:my-2" key={user.id}>
            <div className="col col-1" data-label="Avatar">
              <Image
                alt={user.name ?? "Profile Pic"}
                src={
                  user?.image ??
                  "https://randomuser.me/api/portraits/lego/5.jpg"
                }
                className="ml-5 h-6 w-6 rounded-full"
                height={40}
                width={40}
              />
            </div>
            <div className="col col-3 text-left" data-label="Name">
              {user?.name ?? user.email}
            </div>
            <div className="col col-3 text-left" data-label="Email">
              {user.email}
            </div>
            <div className="col col-1" data-label="Pets Adopted">
              <div className="flex gap-1">
                {" "}
                {user?.Adoption.length <= 0
                  ? "No Pets"
                  :  user.Adoption.map(pet=> (
                    <Image
                      src={pet.Image?.at(0)?.url ?? ""}
                      key={pet.id}
                      width={40}
                      height={40}
                      alt="pet"
                      className=" cursor-pointer h-6 w-6 rounded-full"
                        
                     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                     onClick={()=> router.push(`/pets/id?id=${pet.Image?.at(0)?.petId}`)}
                    />
                  ))}
              </div>
            </div>
            <div className="col col-1" data-label="Preferences">
              {user?.Preference.at(0)?.type ?? "Not Specified"}
            </div>
            <div className="col col-2" data-label="Favourites">
            <div className="flex gap-1">
            {user?.Favorite.length <= 0
                  ? "No Pets"
                  : user.Favorite.map(pet=> (
                    <Image
                      src={pet.Image?.at(0)?.url ?? ""}
                      key={pet.id}
                      width={40}
                      height={40}
                      alt="pet"
                      className=" cursor-pointer h-6 w-6 rounded-full"
                        
                     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                     onClick={()=> router.push(`/pets/id?id=${pet.Image?.at(0)?.petId}`)}
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

export default AdoptersTable;
