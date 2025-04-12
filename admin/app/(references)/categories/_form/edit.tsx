"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Boolean } from "@/src/components/ui/boolean";
import { Id, toast } from "react-toastify";
import { Category } from "@/src/types/Category";

let idToast: Id;

const CategorySchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères."),
    isActive: z.boolean()
})

const updateCategory = async ({ id, name, isActive }: { id: number, name: string, isActive: boolean }) => {
    const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name,
            isActive
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
    return data;
}

export function EditForm({ category }: { category: Category }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string[], isActive: string[] }>({ name: [], isActive: [] });

    const { mutate, isPending } = useMutation({
        mutationFn: updateCategory,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Catégorie mise à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const isActive = formData.get("isActive") === "1" ? true : false;

        const validationResult = CategorySchema.safeParse({ name, isActive });

        if (!validationResult.success) {
            setErrors({
                name: validationResult.error.flatten().fieldErrors.name || [],
                isActive: validationResult.error.flatten().fieldErrors.isActive || []
            });
            return;
        }

        setErrors({ name: [], isActive: [] });

        mutate({ 
            id: category.id,
            name: validationResult.data.name,
            isActive: validationResult.data.isActive
        });
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
                    <DialogTitle>Modifier une catégorie</DialogTitle>
                    <DialogDescription>Modification de la catégorie {category.name}</DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" defaultValue={category.name} required disabled={isPending} />
                        {errors.name.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.name.join(", ")}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="isActive">Actif :</Label>
                        <Boolean name="isActive" id="isActive" defaultValue={category.isActive} disabled={isPending} />
                        {errors.isActive.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.isActive.join(", ")}</p>
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