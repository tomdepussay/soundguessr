"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Plus } from "lucide-react";
import { PermissionSchema } from "@/src/validation/permission";
import { useState } from "react";
import { MultiSelect } from "@/src/components/ui/multi-select";
import { Role } from "@/src/types/Role";
import { useAddPermission } from "@/src/hooks/use-permissions";

const defaultValues = ["1"];

interface AddFormProps {
    roles: Role[];
}

export function AddForm({ roles }: AddFormProps) {

    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(defaultValues);
    const [errors, setErrors] = useState<{ name: string[], description: string[], roles: string[] }>({ name: [], description: [], roles: []  });
    
    const { mutate, isPending } = useAddPermission();

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

        setSelectedRoles(defaultValues);

        setErrors({ name: [], description: [], roles: []  });

        mutate({ 
            name: validationResult.data.name, 
            description: validationResult.data.description,
            roles: validationResult.data.roles
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
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="roles">Rôles (optionnel) :</Label>
                        <MultiSelect
                            id="roles"
                            name="roles"
                            options={roles.map((role) => ({ value: String(role.id), label: role.name }))}
                            selected={selectedRoles}
                            onChange={setSelectedRoles}
                            placeholder="Sélectionner des rôles"
                        />
                        {errors.roles.length > 0 && (
                            <p className="text-red-500 text-sm">{errors.roles.join(", ")}</p>
                        )}
                    </div>
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