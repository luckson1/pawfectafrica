import Head from "next/head";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { AiFillSnippets } from "react-icons/ai";
import { MdPets } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import { FaFileContract } from "react-icons/fa";
import LoadingSkeleton from "~/components/loading/LoadingSkeletons";
import { api } from "~/utils/api";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

function PetId() {
  const params = useSearchParams();

  const id = params.get("id") ?? "";
  type PetImage = {
    url: string;
    id: string;
  };
  const { data } = useSession();
  const userId = data?.user.id;
  enum DisplayTypes {
    BIO = "BIO",
    DONOR = "DONOR",
    HEALTH = "HEALTH",
  }
  const [display, setDisplay] = useState(DisplayTypes.BIO);
  const [currentImage, setCurrentImage] = useState<PetImage>();
  const {
    data: pet,
    isLoading,
    isError,
    error,
  } = api.pet.getOnePet.useQuery(
    { id },
    {
      onSuccess: (data) => setCurrentImage(data.Image.at(0)),
    }
  );
  const ctx = api.useContext();
  const router = useRouter();
  const { mutate: apply, isLoading: isApplicationLoading } =
    api.user.initiateAdoption.useMutation({
      onSuccess: () => toast.success("Application sent successfully"),
      onSettled: ()=> ctx.pet.getOnePet.invalidate(),
      onError: (data) => toast.error(`An Error Occured: ${data.message}`),
    });
  const { mutate: acceptApplication, isLoading: isAcceptanceLoading } =
    api.pet.acceptAdoptionApplication.useMutation({
      onSettled: () => ctx.pet.getOnePet.invalidate(),
    });
    const { mutate: rejectApplication, isLoading: isRejectionLoading } =
    api.pet.rejectAdoptionApplication.useMutation({
      onSettled: () => ctx.pet.getOnePet.invalidate(),
    });
  const userApplicationsStatus = (
    pet && pet.AdoptionInterest.filter((p) => p.userId === userId)
  )?.at(0)?.status;

  const isDonorView = (pet && pet.donor.id === userId) ?? false;
  const allApplications = pet?.AdoptionInterest.map((p) => p);

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
  if (!pet && !isLoading) {
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
    <>
      <Head>
        <title>Jenga</title>
        <meta name="description" content={pet.name} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className=" my-16 flex flex-col gap-10">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex h-fit min-h-[50vh] w-screen flex-col gap-10 ">
          <div className=" flex h-full  w-full flex-col justify-center gap-10  lg:h-[90%] lg:flex-row lg:pt-10 ">
            <div className="ld:justify-center flex h-[50%] w-full flex-col-reverse items-center justify-end gap-3 lg:h-full lg:w-[55%] lg:flex-row ">
              <div className="relative mx-5 flex h-16 w-full flex-row items-center justify-center gap-2 p-5 lg:ml-8 lg:h-full lg:w-16 lg:flex-col">
                {pet.Image &&
                  pet.Image?.map((image) => (
                    <div
                      key={image.id}
                      className={`relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-scroll rounded-lg lg:h-16 lg:w-16 ${
                        currentImage?.id === image.id
                          ? "outline outline-2 outline-primary"
                          : ""
                      }`}
                      onClick={() => setCurrentImage(image)}
                    >
                      <Image
                        key={image.id}
                        src={image.url}
                        alt={pet.name}
                        fill
                        sizes="(max-width: 768px) 40px,
            (max-width: 1200px) 50px,
            50px"
                        className="mx-auto my-auto rounded-lg"
                      />
                    </div>
                  ))}
              </div>
              <div className=" card   mx-auto    flex w-full max-w-2xl   rounded-lg shadow-base-content lg:my-auto  lg:shadow-lg">
                <div className="relative  h-full w-full">
                  {currentImage && (
                    <Image
                      src={currentImage?.url}
                      alt={pet?.name ?? " Product"}
                      quality={100}
                      width={200}
                      height={150}
                      sizes="(max-width: 768px) 80vw,
            (max-width: 1200px) 80vw,
            80vw"
                      className="h-full w-full rounded-b-lg sm:rounded-lg"
                    />
                  )}
                </div>
                {currentImage && pet.Image && (
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    {/* provide logic of displaying the carousel images */}
                    <button
                      className="btn-circle btn bg-base-100 bg-opacity-30 text-xl text-slate-900 dark:text-slate-300 "
                      onClick={() =>
                        pet.Image?.indexOf(currentImage) === 0
                          ? setCurrentImage(pet.Image[pet.Image?.length - 1])
                          : setCurrentImage(
                              pet.Image?.at(pet.Image.indexOf(currentImage) - 1)
                            )
                      }
                    >
                      ❮
                    </button>
                    <button
                      className="btn-circle btn bg-base-100 bg-opacity-30 text-xl text-slate-900 dark:text-slate-300 "
                      onClick={() =>
                        pet.Image?.indexOf(currentImage) ===
                        pet.Image.length - 1
                          ? setCurrentImage(pet.Image[0])
                          : setCurrentImage(
                              pet.Image[pet.Image.indexOf(currentImage) + 1]
                            )
                      }
                    >
                      ❯
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex h-[50%] w-full flex-col items-center justify-around  lg:h-full lg:w-[35%]">
              <div className=" card mx-auto my-auto   w-full max-w-xl rounded-lg bg-base-100 shadow-base-content lg:shadow-lg ">
                {!isDonorView && (
                  <div className="card-body w-full">
                    <p className="text-center text-2xl tracking-widest text-blue-700">
                      {pet.name}
                    </p>
                    {!userApplicationsStatus && (
                      <button
                        onClick={() => apply({ id: pet.id })}
                        disabled={isApplicationLoading}
                        className=" my-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-secondary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        Apply to adopt {pet.name}
                      </button>
                    )}
                    {userApplicationsStatus === "PENDING" && (
                      <p className="text-center text-amber-500">
                        Your adoption application Pending. Contact the owner on whatsapp to arrange a phone interview
                      </p>
                    )}
                    {userApplicationsStatus === "ACCEPTED" && (
                      <p className="text-center text-xl text-green-500">
                        Your adoption application has been Accepted!
                      </p>
                    )}
                    {userApplicationsStatus === "REJECTED" && (
                      <p className="text-center text-xl text-red-500">
                        Your adoption application has been Rejected!
                      </p>
                    )}
                    <p className="text-center text-xl"> Adoption process</p>
                    <ul className="flex flex-col gap-y-3">
                      <li className="flex flex-row gap-5">
                        <AiFillSnippets className="h-6 w-6" />
                        Submit application
                      </li>
                      <li className="flex flex-row gap-5">
                        {" "}
                        <GoCommentDiscussion className="h-6 w-6" /> Interview
                        with adoption cordinator
                      </li>
                      <li className="flex flex-row gap-5">
                        {" "}
                        <MdPets className="h-6 w-6" /> Meet the pet
                      </li>
                      <li className="flex flex-row gap-5">
                        <MdPayment className="h-6 w-6" /> Pay fee
                      </li>
                      <li className="flex flex-row gap-5">
                        <FaFileContract className="h-6 w-6" /> Sign adoption
                        contract
                      </li>
                    </ul>
                    {pet.donor.DonorProfile?.at(0) && (
                      <a
                        href={`https://wa.me/${
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          pet.donor.DonorProfile?.at(0)?.phoneNumber
                        }`}
                        target="_blank"
                        className=" my-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-green-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        <BsWhatsapp className="h-6 w-6" /> Chat with the owner
                      </a>
                    )}
                  </div>
                )}
                {isDonorView && (
                  <div className="card-body w-full">
                    <p className="text text-center text-xl">
                      Adoption Applications
                    </p>

                    {allApplications?.map((application) => (
                      <div
                        className=" flex  w-full cursor-pointer flex-row flex-wrap items-center justify-between gap-2 rounded-md border border-base-200 p-3 shadow-md md:shadow-none"
                        key={application.id}
                        onClick={() =>
                          router.push(`/users/id?id=${application.user.id}`)
                        }
                      >
                        <Image
                          alt={application.user.name ?? "Profile Pic"}
                          src={
                            application?.user.image ??
                            "https://randomuser.me/api/portraits/lego/5.jpg"
                          }
                          className="h-10 w-10 rounded-full"
                          width={100}
                          height={100}
                        />
                        <p className="text-center text-blue-500 underline">{application.user.name}</p>
                        {application.status === "ACCEPTED" && (
                          <p className="text-green-500">Accepted</p>
                        )}
                        {application.status === "REJECTED" && (
                          <p className="text-red-500">Rejected</p>
                        )}
                        {application.status === "PENDING" && (
                          <div className="flex flex-row gap-2 ">
                            <button
                              disabled={isAcceptanceLoading || isRejectionLoading}
                              className="btn-sm btn gap-2 bg-green-500 text-xs capitalize"
                              onClick={(e) =>{
                                acceptApplication({
                                  id: application.id,
                                  status: "ACCEPTED",
                                  petId: pet.id,
                                  userId: application.userId
                                }); e.stopPropagation()}
                              }
                            >
                              {" "}
                              <IoMdCheckmarkCircleOutline className="h-4 w-4" />{" "}
                              Accept
                            </button>
                            <button
                             disabled={isAcceptanceLoading || isRejectionLoading}
                              className="btn-sm btn gap-2 bg-red-500 text-xs capitalize"
                              onClick={(e) =>{
                                rejectApplication({
                                  id: application.id,
                                  status: "REJECTED",
                                  petId: pet.id,
                                  userId: application.userId
                                }) ; e.stopPropagation() }
                              }
                            >
                              {" "}
                              <ImCancelCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mb-16 flex h-fit w-[90%] flex-col  justify-start  gap-5 ">
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
              onClick={() => setDisplay(DisplayTypes.DONOR)}
              className={`tab-lifted tab ${
                display === DisplayTypes.DONOR ? "tab-active" : ""
              }`}
            >
              Donor
            </button>
            <button
              onClick={() => setDisplay(DisplayTypes.HEALTH)}
              className={`tab-lifted tab ${
                display === DisplayTypes.HEALTH ? "tab-active" : ""
              }`}
            >
              Health
            </button>
          </div>
          {display === DisplayTypes.BIO && (
            <div className=" flex flex-col gap-5">
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Name: </p>

                <p> {pet.name}</p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Age Range: </p>

                <p> {pet.ageRange} Years</p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Breed: </p>

                <p> {pet.breed}</p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Gender </p>

                <p> {pet.gender}</p>
              </div>

              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold">
                  {" "}
                  Needs access to a garden?{" "}
                </p>

                <p>
                  {" "}
                  {pet.isActive
                    ? "Very active needs access to a private garden"
                    : "It is house trained and can live indoors"}
                </p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Socialised with Kids? </p>

                <p>
                  {" "}
                  {pet.isChildrenSafe
                    ? "Yes, can relate well with kids below 10 years"
                    : "Teenagers Only"}
                </p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold">
                  {" "}
                  Not social to pets, such as:{" "}
                </p>

                <p>
                  {" "}
                  {pet.petTorrelance === "BIRD"
                    ? "Birds"
                    : pet.petTorrelance === "CAT"
                    ? "Cats"
                    : pet.petTorrelance === "DOG"
                    ? "Dogs"
                    : pet.petTorrelance === "NONE"
                    ? "Friendly to all Pets"
                    : "Not friendly to other pets"}
                </p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> Bio: </p>

                <p> {pet.description}</p>
              </div>
            </div>
          )}
          {display === DisplayTypes.DONOR && (
            <div className=" flex flex-col gap-5">
              <div className="flex flex-row gap-5">
                <p className=" font-bold">Name:</p>

                <p> {pet.donor.name}</p>
              </div>
            </div>
          )}

          {display === DisplayTypes["HEALTH"] && (
            <div className=" flex flex-col gap-5">
              <div className="flex flex-row gap-5">
                <p className=" font-bold">Neutered?</p>

                <p>{pet.isNeutered ? "Yes" : "No"}</p>
              </div>
              <div className="mt-2 flex flex-row gap-5">
                <p className="h2 text-lg font-bold"> How active is the pet? </p>

                <p>
                  {" "}
                  {pet.isActive
                    ? "Very active and can participate in straineous esxcercise"
                    : "Not so active, but can go for walks"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PetId;
