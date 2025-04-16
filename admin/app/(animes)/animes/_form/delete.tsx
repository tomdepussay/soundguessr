"use client"

import { Button } from "@/src/components/ui/button"
import { Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import { Anime } from "@/src/types/Anime";
import { useDeleteAnime } from "@/src/hooks/use-animes";

export function DeleteForm({ anime }: { anime: Anime }) {

    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useDeleteAnime();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        mutate({ id: anime.id }, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer un anime</AlertDialogTitle>
                    <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer l'anime {anime.title} ?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary">Annuler</Button>
                    </AlertDialogCancel>
                    <form action="#" onSubmit={submit}>
                        <Button type="submit" variant="destructive" disabled={isPending}>
                            {isPending ? "Suppression..." : "Supprimer"}
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}