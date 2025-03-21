"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Plus } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Boolean } from "@/src/components/ui/boolean";
import { Id, toast } from "react-toastify";

const CategorySchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères."),
    is_active: z.boolean()
})

let idToast: Id;

const addCategory = async ({ name, is_active }: { name: string, is_active: boolean }) => {
    const res = await fetch(`/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name,
            is_active
        }),
    });
    if (!res.ok) throw new Error("Échec de l'ajout");
    return res.json();
}


export function AddForm() {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string[], is_active: string[] }>({ name: [], is_active: [] });

    const { mutate, isPending } = useMutation({
        mutationFn: addCategory,
        onMutate: () => {
            idToast = toast.loading("Ajout en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: "Échec de l'ajout", type: "error", isLoading: false });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Catégorie ajoutée", type: "success", isLoading: false });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const is_active = formData.get("is_active") === "1" ? true : false;

        const validationResult = CategorySchema.safeParse({ name, is_active });

        if (!validationResult.success) {
            setErrors({
                name: validationResult.error.flatten().fieldErrors.name || [],
                is_active: validationResult.error.flatten().fieldErrors.is_active || []
            });
            return;
        }

        setErrors({ name: [], is_active: [] });

        mutate({ 
            name: validationResult.data.name, 
            is_active: validationResult.data.is_active 
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Plus />
                    Ajouter une catégorie
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter une catégorie</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" required disabled={isPending} />
                        {errors.name.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.name.join(", ")}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="is_active">Actif :</Label>
                        <Boolean name="is_active" id="is_active" defaultValue={true} disabled={isPending} />
                        {errors.is_active.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.is_active.join(", ")}</p>
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