import { Button } from "@/src/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Role } from "@/src/types/Role";
import { Permission } from "@/src/types/Permission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Id, toast } from "react-toastify";

let idToast: Id;

type AssignFormProps = {
    role: Role
}

async function fetchAssignRole(roleId: number) {
    const response = await fetch(`/api/roles/${roleId}/assign`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        } 
    })
    const data: Permission[] = await response.json();
    return data;
}

async function assign({ roleId, permissionIds }: { roleId: number, permissionIds: number[] }){
    const response = await fetch(`/api/roles/${roleId}/assign`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            permissionIds
        })
    })
    if (!response.ok) throw new Error("Échec de la mise à jour");
    return response.json();
}

export function AssignForm({ role }: AssignFormProps){

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);

    const { data: permissions, isLoading: fetchIsLoading, error: fetchError } = useQuery({ 
        queryKey: [`fetchAssignRole`], 
        queryFn: () => fetchAssignRole(role.id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: assign,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info" });
        },
        onError: () => {
            toast.update(idToast, { render: "Échec de la mise à jour", type: "error", isLoading: false, autoClose: 2000 });
        },
        onSuccess: () => {
            setOpen(false);
            toast.update(idToast, { render: "Rôle mis à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    })

    const handleCheckboxChange = (permissionId: number) => {
        if(selected.includes(permissionId)){
            setSelected(selected.filter((id) => id !== permissionId)); 
        } else {
            setSelected([...selected, permissionId]);
        }
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        mutate({ roleId: role.id, permissionIds: selected });
    }

    const deselectedAll = () => {
        setSelected([]);
    }

    useEffect(() => {
        role.permissions?.forEach((permission) => setSelected((prev) => [...prev, permission.id] as number[]))
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="secondary">
                    <ArrowRightLeft />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl">Assigner des permissions</DialogTitle>
                    <DialogDescription>Assigner des permissions au role {role.name}</DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    <Input 
                        type="text" 
                        placeholder="Rechercher une permission"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                    <div className="flex flex-col gap-2 overflow-y-auto h-100">
                        {
                            fetchIsLoading ? 
                                <p>Chargement...</p> :
                            permissions?.filter(
                                (permission) => permission.name.toLowerCase().includes(search.toLowerCase())
                            ).map((permission, index) => (
                                <Card key={index} className="py-4">
                                    <CardContent className="flex justify-start items-center">
                                        <Checkbox 
                                            id={permission.name} 
                                            name={permission.name} 
                                            value={permission.id} 
                                            checked={selected.includes(permission.id)}
                                            onClick={() => handleCheckboxChange(permission.id)}
                                        />
                                        <Label htmlFor={permission.name} className="flex-1 flex flex-col justify-start items-start gap-1 pl-4">
                                            <span className="text-lg">{permission.description}</span>
                                            <span>{permission.name}</span>
                                        </Label>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                    <DialogFooter>
                        <Button type="submit">{ isPending ? "Chargement..." : "Assigner" }</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isPending} onClick={deselectedAll}>Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

}