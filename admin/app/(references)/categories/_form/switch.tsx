import { Button } from "@/src/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { Id, toast } from "react-toastify";
import { Category } from "@/src/types/Category";

let idToast: Id;

type SwitchProps = {
    category: Category;
}

const switchCategory = async ({ id }: { id: number }) => {
    const res = await fetch(`/api/categories/${id}/switch`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
    return data;
}

export function Switch({ category }: SwitchProps) {

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: switchCategory,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info", autoClose: false });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.update(idToast, { render: "Mise à jour effectuée", type: "success", autoClose: 2000, isLoading: false });
        },
    });

    const handleClick = async () => {
        mutate({ id: category.id });
    }

    return (
        <Button variant={category.isActive ? "default" : "destructive"} disabled={isPending} onClick={handleClick}>
            {
                category.isActive ? (
                    <ToggleRight />
                ) : (
                    <ToggleLeft />
                )
            }
        </Button>
    )
}