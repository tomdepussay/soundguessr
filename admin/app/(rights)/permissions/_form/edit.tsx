"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";

type Permission = {
    id_permission: number;
    name: string;
    description: string | null;
}

const PermissionSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères."),
    description: z.string().optional()
})

const updatePermission = async ({ id_permission, name, description }: { id_permission: number, name: string, description: string | undefined }) => {
    const res = await fetch(`/api/permissions/${id_permission}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name,
            description
        }),
    });
    if (!res.ok) throw new Error("Échec de la mise à jour");
    return res.json();
}


export function EditPermissionForm({ permission }: { permission: Permission }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string[], description: string[] }>({ name: [], description: [] });

    const { mutate, isPending } = useMutation({
        mutationFn: updatePermission,
        onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        const validationResult = PermissionSchema.safeParse({ name, description });

        if (!validationResult.success) {
            setErrors({
                name: validationResult.error.flatten().fieldErrors.name || [],
                description: validationResult.error.flatten().fieldErrors.description || []
            });
            return;
        }

        setErrors({ name: [], description: [] });

        mutate({ 
            id_permission: permission.id_permission, 
            name: validationResult.data.name,
            description: validationResult.data.description
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
                    <DialogTitle>Modifier une permission</DialogTitle>
                    <DialogDescription>Modification de la permission {permission.name}</DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" defaultValue={permission.name} required disabled={isPending} />
                        {errors.name.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.name.join(", ")}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description :</Label>
                        <Input type="text" name="description" id="description" defaultValue={permission.description ?? ""} disabled={isPending} />
                        {errors.description.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.description.join(", ")}</p>
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