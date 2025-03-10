'use client'

import { login } from "./actions"
import { useActionState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card"
import { Button, buttonVariants } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"
import { cn } from "@/src/lib/utils"

export function LoginForm(){

    const [state, action, pending] = useActionState(login, null)

    return (
        <Card className="w-full h-full md:w-100 md:h-fit">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Se connecter</CardTitle>
                <CardDescription className="text-center">Connectez-vous à votre compte</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input type="email" name="email" id="email" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input type="password" name="password" id="password" required />
                    </div>
                        
                    {state?.error && <p className="text-destructive">{state.error}</p>}

                    <Button className="w-full mt-2" size="lg" type="submit" disabled={pending}>
                        {pending ? "Chargement..." : "Se connecter"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col justify-center">
                <p>
                    Pas de compte ?
                    <Link className={cn(buttonVariants({variant: "link"}), "p-1")} href="/signup">Créer un compte</Link> 
                </p>
            </CardFooter>
        </Card>
    )
}