"use client"

import { Button } from "@/src/components/ui/button"
import { Trash } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import { Id, toast } from "react-toastify";

type Permission = {
    id_permission: number;
    name: string;
    description: string | null;
}

let idToast: Id;

const deletePermission = async ({ id_permission }: { id_permission: number }) => {
    const res = await fetch(`/api/permissions/${id_permission}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Échec de la suppression");
    return res.json();
}


export function DeleteForm({ permission }: { permission: Permission }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: deletePermission,
        onMutate: () => {
            idToast = toast.loading("Suppression en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: "Échec de la suppression", type: "error", isLoading: false, autoClose: 2000 });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Permission supprimée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        mutate({ id_permission: permission.id_permission });
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