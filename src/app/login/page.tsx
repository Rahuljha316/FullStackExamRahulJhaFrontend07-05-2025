'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

const LoginValidation = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters")
})

export default function LoginPage() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState("")

    const router = useRouter()

    const handleLoginClick = async () => {
        const validation = LoginValidation.safeParse({ email, password })

        if (!validation.success) {
            const errorMes = validation.error.errors[0].message
            setError(errorMes)
            return
        }

        try {
            const response = await axios.post("https://fullstackexamrahuljhabackend07-05-2025.onrender.com/api/auth/login", {
                email, password
            })
            const token = response.data.token;
            localStorage.setItem('token', token);
            router.push('/products')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "Login Failed");
            } else {
                setError("An unexpected error occurred");
            }

        }

    }
    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h2 className="text-2xl font-bold">Login</h2>
            <div className="flex flex-col gap-4 ">
                <Input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={handleLoginClick}>Login</Button>

            </div>

        </div>
    )

}