"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Plus } from "lucide-react";
import { useQueryClient , useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Id, toast } from "react-toastify";
import { MultiSelect } from "@/src/components/ui/multi-select";
import { Role } from "@/src/types/Role";

let idToast: Id;

const PermissionSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères."),
    description: z.string().optional(),
    roles: z.array(z.string()).optional()
})

const addPermission = async ({ name, description, roles }: { name: string, description: string | undefined, roles: string[] | undefined }) => {
    const res = await fetch(`/api/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name,
            description,
            roles
        }),
    });
    if (!res.ok) throw new Error("Échec de l'ajout");
    return res.json();
}

const fetchPermissionsRoles = async () => {
    const res = await fetch("/api/permissions/roles", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Échec de la récupération des rôles");
    const data: Role[] = await res.json();
    return data;
}

export function AddForm() {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ name: string[], description: string[], roles: string[] }>({ name: [], description: [], roles: []  });
    
    const { data: roles, isLoading, error } = useQuery({
        queryFn: fetchPermissionsRoles,
        queryKey: ["permissionsRoles"]
    });

    const { mutate, isPending } = useMutation({
        mutationFn: addPermission,
        onMutate: () => {
            idToast = toast.loading("Ajout en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: "Échec de l'ajout", type: "error", isLoading: false, autoClose: 2000 });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Permission ajoutée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const roles = selectedRoles;

        const validationResult = PermissionSchema.safeParse({ name, description, roles });

        if (!validationResult.success) {
            setErrors({
                name: validationResult.error.flatten().fieldErrors.name || [],
                description: validationResult.error.flatten().fieldErrors.description || [],
                roles: validationResult.error.flatten().fieldErrors.roles || [] 
            });
            return;
        }

        setSelectedRoles([]);

        setErrors({ name: [], description: [], roles: []  });

        mutate({ 
            name: validationResult.data.name, 
            description: validationResult.data.description,
            roles: validationResult.data.roles
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Plus />
                    Ajouter une permission
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Ajouter une permission</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" required disabled={isPending} />
                        {errors.name.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.name.join(", ")}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description (optionnel) :</Label>
                        <Input type="text" name="description" id="description" disabled={isPending} />
                        {errors.description.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.description.join(", ")}</p>
                        )}
                    </div>
                    {!isLoading && roles && (
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="roles">Rôles (optionnel) :</Label>
                            <MultiSelect
                                options={roles.map((role) => ({ value: String(role.id), label: role.name }))}
                                selected={selectedRoles}
                                onChange={setSelectedRoles}
                                placeholder="Sélectionner des rôles"
                            />
                            {errors.roles.length > 0 && (
                                <p className="text-red-500 text-sm">{errors.roles.join(", ")}</p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit">{ isPending ? "Chargement..." : "Ajouter" }</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isPending}>Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}