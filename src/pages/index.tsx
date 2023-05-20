import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "~/components/loading/LoadingSkeletons";
import { Toaster} from "react-hot-toast";
import Image from "next/image";

const Home: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const { status } = session;
  const isAuthed = status === "authenticated";

  // create 6 card skeletons from a singe one
  const skeletonData = Array.from({ length: 6 });
  const {
    data: pets,
    isLoading,
    isError,
    error
  } = api.pet.getFeaturedPets.useQuery();
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
    <>
      <Head>
        <title>PawfectAfrica</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-fit min-h-screen w-screen ">
       

        <div className="flex  h-[calc(100vh-4rem)]  w-full overflow-hidden px-5 md:px-10 lg:flex-col lg:px-20">
          <Toaster position="top-right" reverseOrder={false} />
          <div className=" flex h-full w-full flex-col-reverse lg:flex-row ">
            <div className="flex h-[60%] w-full flex-col items-center justify-around bg-base-100  md:h-[50%] lg:h-full lg:w-[40%]">
              <p className="text-semi-bold text-start text-6xl text-slate-700  dark:text-slate-300 md:text-8xl">
                Ready to Adopt a 🐶 Pet ?
              </p>
              <button
                className="btn-primary btn w-full max-w-sm"
                onClick={
                  isAuthed ? () => signOut() : () => router.push("/auth")
                }
              >
                {isAuthed ? "Sign Out" : "Adopt a Pet"}
              </button>
              <p className="text-start text-xl font-semibold md:text-2xl">
                Let&apos;s get started. Search pets from shelters, rescues, and
                individuals.
              </p>
            </div>
            <div
              className={`flex h-[40%] w-full  items-center justify-center bg-opacity-10 bg-[url(https://res.cloudinary.com/dhciks96e/image/upload/v1683303042/IMG-20220722-WA0009-removebg_c0bkk4.png)] bg-contain  bg-no-repeat md:h-[50%] lg:h-full lg:w-[60%]`}
            ></div>
          </div>
        </div>

        <div className="h-fit w-full bg-accent px-5  py-10 md:px-10 lg:px-20 ">
          <p className="my-12 text-center text-4xl text-slate-900 dark:text-slate-300 ">
            Pets Availabe for Adoption
          </p>
        
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7 justify-center items-center w-full h-full min-h-[50vh]">
          {isLoading ? (
        skeletonData.map((item, index) => (
          <LoadingSkeleton key={index} />
        ))
          ) : (
            pets?.map((pet) => (
         
              <div className="card w-full max-h-[24rem] max-w-sm glass"   key={pet?.id}>
              <figure>  <Image
                  src={pet?.Image.at(0)?.url ?? ""}
                  alt={pet?.name}
                  width={384}
                  height={384}
                  priority
              
                
              
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
        </div>
        <div className="h-screen bg-base-100 ">
          <div className="px-5 md:px-10 lg:px-20">
            <p className="my-12 text-center text-3xl">
              Want to Adopt a Pet? Be in the Know
            </p>

            <div className="flex flex-row flex-wrap justify-between">
              <div className="mt-6 flex flex-col items-center  gap-y-5 ">
                <p className="mb-3 text-2xl font-semibold text-slate-700 dark:text-slate-300 ">
                  Checklist for New Adopters
                </p>
                <p>Learn what you need to ensure adoption success</p>
                <Link
                  href="https://tnrtrust.org/news/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline btn-primary btn px-4"
                >
                  Learn More
                </Link>
              </div>

              <div className="mt-6 flex flex-col items-center gap-y-5 ">
                <p className="mb-3 text-2xl font-semibold text-slate-700 dark:text-slate-300 ">
                  Adoption Process
                </p>
                <p>Get more information on the process of adopting a pet</p>
                <Link
                  href="https://tnrtrust.org/news/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline btn-primary btn px-4"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-6 flex flex-col items-center  gap-y-5 ">
                <p className="mb-3 text-2xl font-semibold text-slate-700 dark:text-slate-300 ">
                  Adoption FAQs
                </p>
                <p>Check what others frequently ask about</p>
                <Link
                  href="https://tnrtrust.org/news/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline btn-primary btn px-4"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <svg
            className="wave-top   mt-20 bg-secondary"
            viewBox="0 0 1439 147"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g
                transform="translate(-1.000000, -14.000000)"
                fillRule="nonzero"
              >
                <g className="wave" fill='hsl(var(--b1)'>
                  <path d="M1440,84 C1383.555,64.3 1342.555,51.3 1317,45 C1259.5,30.824 1206.707,25.526 1169,22 C1129.711,18.326 1044.426,18.475 980,22 C954.25,23.409 922.25,26.742 884,32 C845.122,37.787 818.455,42.121 804,45 C776.833,50.41 728.136,61.77 713,65 C660.023,76.309 621.544,87.729 584,94 C517.525,105.104 484.525,106.438 429,108 C379.49,106.484 342.823,104.484 319,102 C278.571,97.783 231.737,88.736 205,84 C154.629,75.076 86.296,57.743 0,32 L0,0 L1440,0 L1440,84 Z"></path>
                </g>
                <g transform="translate(1.000000, 15.000000)" fill="#FFFFFF">
                  <g transform="translate(719.500000, 68.500000) rotate(-180.000000) translate(-719.500000, -68.500000) ">
                    <path
                      d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
                      opacity="0.100000001"
                    ></path>
                    <path
                      d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                      opacity="0.100000001"
                    ></path>
                    <path
                      d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
                      opacity="0.200000003"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
          <footer className="mx-auto mb-12 mt-0 w-full bg-secondary py-6 text-center  ">
            <div className="container mx-auto px-8">
              <div className="flex w-full flex-col py-6 md:flex-row">
                <div className="mb-6 flex-1 text-black"></div>
                <div className="flex-1">
                  <p className="uppercase text-gray-900   md:mb-6 ">Links</p>
                  <ul className="list-reset mb-6">
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        FAQ
                      </Link>
                    </li>
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Help
                      </Link>
                    </li>
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <p className="uppercase text-gray-900   md:mb-6">Legal</p>
                  <ul className="list-reset mb-6">
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Terms
                      </Link>
                    </li>
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Privacy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <p className="uppercase text-gray-900   md:mb-6">Social</p>
                  <ul className="list-reset mb-6">
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Facebook
                      </Link>
                    </li>
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Linkedin
                      </Link>
                    </li>
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Twitter
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <p className="uppercase text-gray-900   md:mb-6">Company</p>
                  <ul className="list-reset mb-6">
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Official Blog
                      </Link>
                    </li>
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        About Us
                      </Link>
                    </li>
                    <li className="mr-2 mt-2 inline-block md:mr-0 md:block">
                      <Link
                        href="/"
                        className="text-gray-900 no-underline hover:text-pink-500   hover:underline"
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;


