"use client"

import { Button } from "@/src/components/ui/button"
import { Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import { Role } from "@/src/types/Role";
import { useDeleteRole } from "@/src/hooks/use-roles";

export function DeleteForm({ role }: { role: Role }) {

    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useDeleteRole();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        mutate({ id: role.id }, {
            onSuccess: () => {
                setOpen(false);
            },
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
                    <AlertDialogTitle>Supprimer un rôle</AlertDialogTitle>
                    <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer le rôle {role.name} ?</AlertDialogDescription>
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