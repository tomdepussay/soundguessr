"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Edit } from "lucide-react";
import { useActionState } from "react";
import { editRole } from "./action.edit";

type Role = {
    id_role: number;
    name: string;
}

export function EditRoleForm({ role }: { role: Role }) {

    const [state, action, pending] = useActionState(
        (state: any, formData: any) => editRole(state, formData, role.id_role), 
        null
    );

    const [state, action, pending] = useActionState(
        (prevState, formData) => editRole(prevState, formData, role.id_role),
        null
    );

    return (
        <form action={action}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Edit />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier un rôle</DialogTitle>
                        <DialogDescription>Modification du rôle {role.name}</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nom :</Label>
                        <Input type="text" name="name" id="name" defaultValue={role.name} required disabled={pending} />
                        {state?.errors?.name && <p className="text-destructive">{state.errors.name}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit">{ pending ? "Chargement..." : "Enregistrer" }</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={pending}>Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    )
}