'use client'

import { signup } from "./actions"
import { useActionState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card"
import { Button, buttonVariants } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"
import { cn } from "@/src/lib/utils"

export function SignUpForm(){

    const [state, action, pending] = useActionState(signup, null)

    return (
        <Card className="w-full h-full md:w-100 md:h-fit">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
                <CardDescription className="text-center">Créer votre compte</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input type="text" name="username" id="username" required />
                        {state?.errors?.username && <p className="text-destructive">{state.errors.username}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input type="email" name="email" id="email" required />
                        {state?.errors?.email && <p className="text-destructive">{state.errors.email}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input type="password" name="password" id="password" required />
                        {state?.errors?.password && <p className="text-destructive">{state.errors.password}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input type="password" name="confirmPassword" id="confirmPassword" required />
                        {state?.errors?.confirmPassword && <p className="text-destructive">{state.errors.confirmPassword}</p>}
                    </div>

                    <Button className="w-full mt-2" size="lg" type="submit" disabled={pending}>
                        {pending ? "Chargement..." : "Créer un compte"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col justify-center">
                <p>
                    Vous avez déjà un compte ?
                    <Link className={cn(buttonVariants({variant: "link"}), "p-1")} href="/login">Connectez-vous</Link> 
                </p>
            </CardFooter>
        </Card>
    )
}