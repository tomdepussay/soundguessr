import { Button } from "@/src/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { Role } from "@/src/types/Role";

type AssignFormProps = {
    role: Role
}

export function AssignForm({ role }: AssignFormProps){

    const [open, setOpen] = useState(false);

    // const { mutate, isPending } = useMutation({
    //     mutationFn: assignRole,
    //     onMutate: () => {
    //         idToast = toast.loading("Ajout en cours...", { type: "info" });
    //     },
    //     onError: (error) => {
    //         toast.update(idToast, { render: "Échec de l'ajout", type: "error", isLoading: false, autoClose: 2000 });
    //     },
    //     onSuccess: () => {
    //         setOpen(false);
    //         toast.update(idToast, { render: "Rôle ajouté", type: "success", isLoading: false, autoClose: 2000 });
    //         queryClient.invalidateQueries({ queryKey: ["roles"] });
    //     },
    // });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();


    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="secondary">
                    <ArrowRightLeft />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assigner des permissions</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-3" action="#" onSubmit={submit}>
                    
                    <DialogFooter>
                        {/* <Button type="submit">{ isPending ? "Chargement..." : "Assigner" }</Button> */}
                        <Button type="submit">Assigner</Button>
                        <DialogClose asChild>
                            {/* <Button type="button" variant="secondary" disabled={isPending}>Annuler</Button> */}
                            <Button type="button" variant="secondary">Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

}