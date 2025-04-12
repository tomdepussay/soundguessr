"use client"

import { Button } from "@/src/components/ui/button"
import { Trash } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import { Id, toast } from "react-toastify";
import { Role } from "@/src/types/Role";

let idToast: Id;

const deleteRole = async ({ id }: { id: number }) => {
    const res = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
    return data;
}

export function DeleteForm({ role }: { role: Role }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: deleteRole,
        onMutate: () => {
            idToast = toast.loading("Suppression en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Rôle supprimé", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        mutate({ id: role.id });
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