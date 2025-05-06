'use client'
import { redirect } from "next/navigation";
import { useEffect } from "react";



export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    

    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log(token)
        if(!token){
            redirect('/')
        }
    },[])
  return (
    
        <div>
            {children}

        </div>
      
     
  );
}
