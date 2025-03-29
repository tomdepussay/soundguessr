import { Button } from "@/src/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { Id, toast } from "react-toastify";
import { Category } from "@/src/types/Category";

type SwitchProps = {
    category: Category;
}

const switchCategory = async ({ id }: { id: number }) => {
    const res = await fetch(`/api/categories/${id}/switch`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Échec de la mise à jour");
    return res.json();
}

let idToast: Id;

export function Switch({ category }: SwitchProps) {

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: switchCategory,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info", autoClose: false });
        },
        onError: () => {
            toast.update(idToast, { render: "Échec de la mise à jour", type: "error", autoClose: 2000, isLoading: false });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.update(idToast, { render: "Mise à jour effectuée", type: "success", autoClose: 2000, isLoading: false });
        },
    });

    const handleClick = async () => {
        await mutate({ id: category.id });
    }

    return (
        <Button variant={category.isActive ? "default" : "destructive"} disabled={isPending} onClick={handleClick}>
            {
                category.isActive ? 
                <ToggleRight /> :
                <ToggleLeft />
            }
        </Button>
    )
}