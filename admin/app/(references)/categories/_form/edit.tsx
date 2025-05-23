"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { CategorySchema } from "@/src/validation/category";
import { useState } from "react";
import { Boolean } from "@/src/components/ui/boolean";
import { Category } from "@/src/types/Category";
import { useEditCategory } from "@/src/hooks/use-categories";

export function EditForm({ category }: { category: Category }) {

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string[], isActive: string[] }>({ name: [], isActive: [] });

    const { mutate, isPending } = useEditCategory();

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
        }, {
            onSuccess: () => {
                setOpen(false);
            }
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