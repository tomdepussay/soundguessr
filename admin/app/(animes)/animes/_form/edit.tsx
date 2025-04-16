"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { AnimeSchema } from "@/src/validation/anime";
import { useState } from "react";
import { Boolean } from "@/src/components/ui/boolean";
import { Anime } from "@/src/types/Anime";
import { useEditAnime } from "@/src/hooks/use-animes";

export function EditForm({ anime }: { anime: Anime }) {

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ title: string[], isActive: string[], top100: string[], image: string[] }>({ title: [], isActive: [], top100: [], image: [] });

    const { mutate, isPending } = useEditAnime();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title") as string;
        const isActive = formData.get("isActive") === "1" ? true : false;
        const top100 = formData.get("top100") === "1" ? true : false;
        const image = formData.get("image") as File | null;

        const validationResult = AnimeSchema.safeParse({ title, isActive, top100, image });

        if (!validationResult.success) {
            setErrors({
                title: validationResult.error.flatten().fieldErrors.title || [],
                isActive: validationResult.error.flatten().fieldErrors.isActive || [],
                top100: validationResult.error.flatten().fieldErrors.top100 || [],
                image: validationResult.error.flatten().fieldErrors.image || []
            });
            return;
        }

        setErrors({ title: [], isActive: [], top100: [], image: [] });

        mutate({ 
            id: anime.id,
            title: validationResult.data.title,
            isActive: validationResult.data.isActive,
            top100: validationResult.data.top100, 
            image: validationResult.data.image
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
                    <DialogTitle>Modifier un anime</DialogTitle>
                    <DialogDescription>Modification de l'anime {anime.title}</DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Titre :</Label>
                        <Input type="text" name="title" id="title" defaultValue={anime.title} required disabled={isPending} />
                        {errors.title.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.title.join(", ")}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="isActive">Actif :</Label>
                        <Boolean name="isActive" id="isActive" defaultValue={anime.isActive} disabled={isPending} />
                        {errors.isActive.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.isActive.join(", ")}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="top100">Top 100 :</Label>
                        <Boolean name="top100" id="top100" defaultValue={anime.top100} disabled={isPending} />
                        {errors.top100.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.top100.join(", ")}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="image">Image (optionnel) :</Label>
                        <Input type="file" name="image" id="image" accept="image/*" disabled={isPending} />
                        {errors.image.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.image.join(", ")}</p>
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