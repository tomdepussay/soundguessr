"use client"

import { Button } from "@/src/components/ui/button"
import { Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import { Season } from "@/src/types/Season";
import { useDeleteSeason } from "@/src/hooks/use-seasons";

interface DeleteFormProps {
    season: Season;
}

export function DeleteForm({ season }: DeleteFormProps) {

    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useDeleteSeason();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        mutate({ id: season.id }, {
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
                    <AlertDialogTitle>Supprimer une saison</AlertDialogTitle>
                    <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer la saison {season.name} ?</AlertDialogDescription>
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