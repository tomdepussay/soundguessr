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
    is_active: z.boolean()
})

const updateCategory = async ({ id_category, name, is_active }: { id_category: number, name: string, is_active: boolean }) => {
    const res = await fetch(`/api/categories/${id_category}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name,
            is_active
        }),
    });
    if (!res.ok) throw new Error("Échec de la mise à jour");
    return res.json();
}

export function EditForm({ category }: { category: Category }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string[], is_active: string[] }>({ name: [], is_active: [] });

    const { mutate, isPending } = useMutation({
        mutationFn: updateCategory,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info" });
        },
        onError: () => {
            toast.update(idToast, { render: "Échec de la mise à jour", type: "error", isLoading: false, autoClose: 2000 });
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
            id_category: category.id_category,
            name: validationResult.data.name,
            is_active: validationResult.data.is_active
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
                        <Label htmlFor="is_active">Actif :</Label>
                        <Boolean name="is_active" id="is_active" defaultValue={category.is_active} disabled={isPending} />
                        {errors.is_active.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.is_active.join(", ")}</p>
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