"use client";

import { useEffect } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import useAuth from "@/src/hooks/useAuth";
import Loader from "./Loader";


type WrapperProps = {
    children : React.ReactNode;
}
const Wrapper = ({children}:WrapperProps) => {
      const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  return (
    <div>
        <Navbar/>
    <div className= 'px-5 md:px-[10%] mt-8 mb-10'>
        {children}
    </div>
    </div>
  )
}

export default Wrapper