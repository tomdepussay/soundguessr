"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";

type Role = {
    id_role: number;
    name: string;
}

const RoleSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères.")
})

const updateRole = async ({ id_role, name }: {id_role: number, name: string}) => {
    const res = await fetch(`/api/roles/${id_role}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name
        }),
    });
    if (!res.ok) throw new Error("Échec de la mise à jour");
    return res.json();
}

const queryClient = new QueryClient();

export function EditRoleForm({ role }: { role: Role }) {

    const [errors, setErrors] = useState({
        name: [] as string[]
    })

    const { mutate, isPending } = useMutation({
        mutationFn: updateRole,
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        console.log("submit")
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;

        const validationResult = RoleSchema.safeParse({ name });

        if (!validationResult.success) {
            setErrors({
                name: validationResult.error.flatten().fieldErrors.name || []
            })
            return;
        }

        mutate({ id_role: role.id_role, name: validationResult.data.name });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form action="#" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Modifier un rôle</DialogTitle>
                        <DialogDescription>Modification du rôle {role.name}</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" defaultValue={role.name} required disabled={isPending} />
                    </div>
                    <DialogFooter>
                        <Button type="submit">{ isPending ? "Chargement..." : "Enregistrer" }</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isPending}>Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}