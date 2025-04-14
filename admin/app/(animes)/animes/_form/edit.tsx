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
import { Anime } from "@/src/types/Anime";

let idToast: Id;

const AnimeSchema = z.object({
    isActive: z.boolean(),
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères."),
    top100: z.boolean(),
})

const updateAnime = async ({ id, title, isActive, top100 }: { id: number, title: string, isActive: boolean, top100: boolean }) => {
    const res = await fetch(`/api/animes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            title,
            isActive,
            top100
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
    return data;
}

export function EditForm({ anime }: { anime: Anime }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ title: string[], isActive: string[], top100: string[] }>({ title: [], isActive: [], top100: [] });

    const { mutate, isPending } = useMutation({
        mutationFn: updateAnime,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Anime mis à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["animes"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title") as string;
        const isActive = formData.get("isActive") === "1" ? true : false;
        const top100 = formData.get("top100") === "1" ? true : false;

        const validationResult = AnimeSchema.safeParse({ title, isActive, top100 });

        if (!validationResult.success) {
            setErrors({
                title: validationResult.error.flatten().fieldErrors.title || [],
                isActive: validationResult.error.flatten().fieldErrors.isActive || [],
                top100: validationResult.error.flatten().fieldErrors.top100 || []
            });
            return;
        }

        setErrors({ title: [], isActive: [], top100: [] });

        mutate({ 
            id: anime.id,
            title: validationResult.data.title,
            isActive: validationResult.data.isActive,
            top100: validationResult.data.top100, 
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