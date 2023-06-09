import React from "react";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdLogin, MdLogout } from "react-icons/md";

export const Nav = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = session;
  const isAuthed = status === "authenticated";
  const role = data?.user.role;
  const userId=data?.user.id
  console.log(userId)
  const isDonor = role === "ADMIN" || role === "DONOR";

  return (
    <div
      className={`navbar fixed top-0 z-[1000] ${
        isAuthed ? "bg-base-100 shadow-lg" : "bg-accent"
      } px-5 md:px-10 lg:px-20`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          {!isAuthed && (
            <ul
              tabIndex={0}
              className="dropdown-bottom dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <a
                  href="https://tnrtrust.org/news/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resources
                </a>
              </li>
              <li tabIndex={0}>
                <button className="justify-between">
                  Get Started
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </button>
                <ul className="z-100 bg-base-100 p-2 shadow shadow-primary/100">
                  <li>
                    <button
                      onClick={() => {
                        isAuthed ? router.push("/pets") : router.push("/auth");
                      }}
                    >
                      Adopt a pet
                    </button>
                  </li>
                  <li>
                    <button
                    onClick={
                      isAuthed && !isDonor
                        ? () => router.push("/donorOnboarding")
                        : isAuthed && isDonor
                        ? () => router.push("/addPet")
                        : () => {
                            router.push("/auth");
                          }
                    }
                    >
                      Rehome a pet
                    </button>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="https://tnrtrust.org/get-involved-2/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Involved
                </a>
              </li>
              <li>
                {!isDonor && (
                  <button
                    className="btn-primary btn-sm px-5 btn text-sm capitalize text-white"
                    onClick={
                      isAuthed && !isDonor
                        ? () => router.push("/donorOnboarding")
                        : isAuthed && isDonor
                        ? () => router.push("/addPet")
                        : () => {
                            router.push("/auth");
                          }
                    }
                  >
                    Rehome a pet
                  </button>
                )}
              </li>
            </ul>
          )}
          {isAuthed && (
            <ul
              tabIndex={0}
              className="dropdown-bottom dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <button onClick={() => router.push("/pets")}>All pets</button>
              </li>
              <li>
                <button onClick={() => router.push("/mypets")}>My pets</button>
              </li>
              <li>
                {role === "ADMIN" && (
                  <button onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </button>
                )}
              </li>
            </ul>
          )}
        </div>
        <Image
          className="h-10 w-10 rounded-full"
          src={
            "https://res.cloudinary.com/dhciks96e/image/upload/v1683500590/logo_xelip9.png"
          }
          width={50}
          height={50}
          alt="logo"
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
      <div className="navbar-center hidden lg:flex">
        {isAuthed && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <button onClick={() => router.push("/pets")}>All pets</button>
            </li>
            <li>
              <button onClick={() => router.push("/mypets")}>My pets</button>
            </li>
            <li>
              {role === "ADMIN" && (
                <button onClick={() => router.push("/dashboard")}>
                  Dashboard
                </button>
              )}
            </li>
          </ul>
        )}
        {!isAuthed && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <a
                href="https://tnrtrust.org/news/"
                target="_blank"
                rel="noreferrer"
              >
                Resources
              </a>
            </li>
            <li tabIndex={0}>
              <button>
                Get Started
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </button>
              <ul className="z-100 bg-base-100 p-2 shadow shadow-primary/100">
                <li>
                  <button
                    onClick={() => {
                      isAuthed ? router.push("/pets") : router.push("/auth");
                    }}
                  >
                    Adopt a pet
                  </button>
                </li>
                <li>
                  <button
                onClick={
                  isAuthed && !isDonor
                    ? () => router.push("/donorOnboarding")
                    : isAuthed && isDonor
                    ? () => router.push("/addPet")
                    : () => {
                        router.push("/auth");
                      }
                }
                  >
                    Rehome a Pet
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <a
                href="https://tnrtrust.org/get-involved-2/"
                target="_blank"
                rel="noreferrer"
              >
                Get Involved
              </a>
            </li>
          </ul>
        )}
      </div>
      <div className="navbar-end gap-3">
        <button
          className="btn-primary btn-sm px-5 btn hidden text-sm capitalize md:flex"
          onClick={
            isAuthed && !isDonor
              ? () => router.push("/donorOnboarding")
              : isAuthed && isDonor
              ? () => router.push("/addPet")
              : () => {
                  router.push("/auth");
                }
          }
        >
          Rehome a pet
        </button>
       { isAuthed && <Image
                    alt={data?.user.name?? "Profile Pic"}
                    src={data?.user?.image?? "https://randomuser.me/api/portraits/lego/5.jpg"}
                    className="rounded-full h-7 w-7 cursor-pointer"
                    width={40}
                    height={40}
                 onClick={()=> router.push(`/users/id?id=${userId ?? ""}`)}
                  />}
        <button
          className="btn-ghost btn-sm btn gap-3 text-sm capitalize"
          onClick={
            isAuthed
              ? () => signOut()
              : () => {
                  router.push("/auth");
                }
          }
        >
          {isAuthed ? <> <MdLogout className="h-6 w-6" />  Logout</>: <> <MdLogin className="h-6 w-6" /> Login</> }
        </button>
      </div>
    </div>
  );
};
