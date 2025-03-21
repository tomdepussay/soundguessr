"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Id, toast } from "react-toastify";

type Role = {
    id_role: number;
    name: string;
}

let idToast: Id;

const RoleSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères.")
})

const updateRole = async ({ id_role, name }: { id_role: number, name: string }) => {
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


export function EditForm({ role }: { role: Role }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string[] }>({ name: [] });

    const { mutate, isPending } = useMutation({
        mutationFn: updateRole,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: "Échec de la mise à jour", type: "error", isLoading: false, autoClose: 2000 });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Rôle mis à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;

        const validationResult = RoleSchema.safeParse({ name });

        if (!validationResult.success) {
            setErrors({
                name: validationResult.error.flatten().fieldErrors.name || []
            });
            return;
        }

        setErrors({ name: [] });

        mutate({ id_role: role.id_role, name: validationResult.data.name });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier un rôle</DialogTitle>
                    <DialogDescription>Modification du rôle {role.name}</DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" defaultValue={role.name} required disabled={isPending} />
                        {errors.name.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.name.join(", ")}</p>
                        )}
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