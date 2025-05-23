"use client"

import { Button } from "@/src/components/ui/button"
import { Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import { Permission } from "@/src/types/Permission";
import { useDeletePermission } from "@/src/hooks/use-permissions";

export function DeleteForm({ permission }: { permission: Permission }) {

    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useDeletePermission();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        mutate({ id: permission.id });
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
                    <AlertDialogTitle>Supprimer une permission</AlertDialogTitle>
                    <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer la permission {permission.name} ?</AlertDialogDescription>
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