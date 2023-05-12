import { useSession } from "next-auth/react";
import React from "react";
import { Nav } from "~/components/Nav";
import TableLoading from "~/components/loading/TableLoading";
import LoadingSkeleton from "~/components/loading/LoadingSkeletons";
import { usePathname, useRouter } from "next/navigation";
import { LoginCard } from "~/components/authCard";
import DonorOnboarding from "../pages/donorOnboarding";
import Onboarding from "../pages/onboarding";

function Layout({ children }: { children: React.JSX.Element }) {
  const { data, status } = useSession();
  const role = data?.user.role;
  const path = usePathname();
  const router=useRouter()
  const home = path === "/";
  const auth = path === "auth";
  const dashboard = path === "/dashboard";
  const admin = role === "ADMIN";
  const newUser = role === "USER";

if(home) return (
  <div>
    <Nav />
  <div className="mt-16">
  {children}
  </div>
  </div>
);
  if (status === "loading")
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <LoadingSkeleton />
        <TableLoading />
      </div>
    );
  if (status === "unauthenticated" && !home && !auth) return <LoginCard />;
 
  if (auth) return <>{children}</>;

  if (dashboard && !admin)
    return (
      <div className="flex h-screen w-screen flex-col justify-center items-center p-10 md:p-20">
        <div className="h-1/2 w-full">
          <img src="/error.svg" alt="Pet" />
        </div>
        <h2 className="text-6xl text-red-500">You are not authorised</h2>
      <button className="btn btn-secondary w-full max-w-xs" onClick={()=> router.back()}>Go Back</button>
      </div>
    );
 
  if (!home && newUser)
    return (
      <div>
        <Nav />
      <div className="mt-16">
      <Onboarding />
      </div>
      </div>
    );
  return (
    <div>
      <Nav />
    <div className="mt-16">
    {children}
    </div>
    </div>
  );
}

export default Layout;
