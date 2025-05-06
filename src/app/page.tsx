'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      router.push('/products')
    }
  },[router])
  return (
    <div className="flex flex-col justify-center items-center" >
      <h1 className="font-bold text-2xl">Welcome </h1>
      <div className="flex gap-2">
        <Link href="/login">
          <Button className="">Login</Button>

        </Link>
        <Link href="/register">

        <Button variant="secondary">Register</Button>
        </Link>
      </div>
      

      
      
    </div>
  );
}
