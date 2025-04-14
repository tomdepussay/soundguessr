import { Button } from "@/src/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { Id, toast } from "react-toastify";
import { Anime } from "@/src/types/Anime";

let idToast: Id;

type SwitchProps = {
    anime: Anime;
}

const switchAnime = async ({ id }: { id: number }) => {
    const res = await fetch(`/api/animes/${id}/switch`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
    return data;
}

export function Switch({ anime }: SwitchProps) {

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: switchAnime,
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info", autoClose: false });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["animes"] });
            toast.update(idToast, { render: "Mise à jour effectuée", type: "success", autoClose: 2000, isLoading: false });
        },
    });

    const handleClick = async () => {
        mutate({ id: anime.id });
    }

    return (
        <Button variant={anime.isActive ? "default" : "destructive"} disabled={isPending} onClick={handleClick}>
            {
                anime.isActive ? (
                    <ToggleRight />
                ) : (
                    <ToggleLeft />
                )
            }
        </Button>
    )
}