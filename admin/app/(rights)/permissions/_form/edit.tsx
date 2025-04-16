"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { PermissionSchema } from "@/src/validation/permission";
import { useState } from "react";
import { Permission } from "@/src/types/Permission";
import { Role } from "@/src/types/Role";
import { MultiSelect } from "@/src/components/ui/multi-select";
import { useEditPermission } from "@/src/hooks/use-permissions";

interface EditFormProps {
    permission: Permission;
    roles: Role[];
}

export function EditForm({ permission, roles }: EditFormProps) {

    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        permission.roles?.map((role) => String(role.id)) || []
    );
    const [errors, setErrors] = useState<{ name: string[], description: string[], roles: string[] }>({ name: [], description: [], roles: [] });

    const { mutate, isPending } = useEditPermission();

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

        setErrors({ name: [], description: [], roles: [] });

        mutate({ 
            id: permission.id, 
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