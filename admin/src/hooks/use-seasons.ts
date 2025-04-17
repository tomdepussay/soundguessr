import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Season } from "@/src/types/Season";
import { Id, toast } from "react-toastify";

let idToast: Id;

export const useSeasons = (page: number) => {
    return useQuery({
        queryKey: ["seasons", page],
        queryFn: async () => {
            const res = await fetch("/api/seasons?" + new URLSearchParams({ page: String(page) }));
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur inconnue");
            }

            const data: {
                seasons: Season[];
                pages: number;
            } = await res.json();

            return data;
        }
    });
};

export const useAddSeason = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ name }: { name: string }) => {
            const res = await fetch(`/api/seasons`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
            return data;
        },
        onMutate: () => {
            idToast = toast.loading("Ajout en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false, autoClose: 2000 });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Saison ajoutée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["seasons"] });
        },
    })

    return { mutate, isPending };
}

export const useEditSeason = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id, name }: { id: number, name: string }) => {
            const res = await fetch(`/api/seasons/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
            return data;
        },
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false, autoClose: 2000 });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Saison mise à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["seasons"] });
        },
    })

    return { mutate, isPending };
}

export const useDeleteSeason = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await fetch(`/api/seasons/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
            return data;
        },
        onMutate: () => {
            idToast = toast.loading("Suppression en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false, autoClose: 2000 });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Saison supprimée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["seasons"] });
        },
    })

    return { mutate, isPending };
}