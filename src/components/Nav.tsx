import React, { type Dispatch, type SetStateAction } from "react";



import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export const Nav = () => {

const router=useRouter()
const session=useSession()
const {data, status}=session
const isAuthed=status==="authenticated"



  return (
    <div className="navbar bg-secondary px-5 md:px-10 lg:px-20">
  <div className="navbar-start">
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </label>
      <ul tabIndex={0} className="menu menu-compact dropdown-content dropdown-bottom mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li><a href="https://tnrtrust.org/news/"   target="_blank"  rel="noreferrer" >Resources</a></li>
        <li tabIndex={0}>
          <button className="justify-between">
          Get Started
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
          </button>
          <ul className="p-2 bg-base-100 z-100 shadow shadow-primary/100">
          <li><button      onClick={() => {
                isAuthed ? router.push("/pets") : router.push("/auth");
              }}>Adopt a pet</button></li>
          <li><button    onClick={() => {
                    router.push("/doner-onboarding");
                  }}>Rehome a pet</button></li>
        </ul>
        </li>
        <li><a href="https://tnrtrust.org/get-involved-2/"  target="_blank"  rel="noreferrer">Get Involved</a></li>
      </ul>
    </div>
    <Image
          className="h-10 w-10 rounded-full"
          src={"https://res.cloudinary.com/dhciks96e/image/upload/v1683500590/logo_xelip9.png"}
          width={50}
          height={50}
          alt="logo"
          onClick={() => {
            router.push("/");
          }}
        />
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <li><a href="https://tnrtrust.org/news/"   target="_blank"  rel="noreferrer" >Resources</a></li>
      <li tabIndex={0}>
        <button>
          Get Started
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
        </button>
        <ul className="p-2 bg-base-100 z-100 shadow shadow-primary/100">
          <li><button      onClick={() => {
                  isAuthed ? router.push("/pets") : router.push("/auth");
              }}>Adopt a pet</button></li>
          <li><button    onClick={() => {
                    router.push("/doner-onboarding");
                  }}>Rehome a Pet</button></li>
        </ul>
      </li>
      <li><a href="https://tnrtrust.org/get-involved-2/"  target="_blank"  rel="noreferrer">Get Involved</a></li>
    </ul>
  </div>
  <div className="navbar-end">
    <button className="btn btn-primary"     onClick={
             isAuthed
                ? () => signOut()
                : () => {             
                  
                    router.push("/auth");
                 
                  }
            }
          >
            {isAuthed ? "Logout" : "Login"}</button>
  </div>
</div>
  
  );
};
