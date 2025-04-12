"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Plus } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Id, toast } from "react-toastify";

let idToast: Id;

const RoleSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères.")
})

const addRole = async ({ name }: { name: string }) => {
    const res = await fetch(`/api/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
    return data;
}

export function AddForm() {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string[] }>({ name: [] });

    const { mutate, isPending } = useMutation({
        mutationFn: addRole,
        onMutate: () => {
            idToast = toast.loading("Ajout en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Rôle ajouté", type: "success", isLoading: false, autoClose: 2000 });
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

        mutate({ name: validationResult.data.name });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Plus />
                    Ajouter un rôle
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Ajouter un rôle</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" required disabled={isPending} />
                        {errors.name.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.name.join(", ")}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit">{ isPending ? "Chargement..." : "Ajouter" }</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isPending}>Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}