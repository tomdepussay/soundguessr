import { Button } from "@/src/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { Id, toast } from "react-toastify";

type SwitchProps = {
    category: Category;
}

type Category = {
    id_category: number;
    name: string;
    is_active: boolean;
}

const switchCategory = async ({ id_category }: { id_category: number }) => {
    const res = await fetch(`/api/categories/${id_category}/switch`, {
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
        await mutate({ id_category: category.id_category });
    }

    return (
        <Button variant={category.is_active ? "default" : "destructive"} disabled={isPending} onClick={handleClick}>
            {
                category.is_active ? 
                <ToggleRight /> :
                <ToggleLeft />
            }
        </Button>
    )
}