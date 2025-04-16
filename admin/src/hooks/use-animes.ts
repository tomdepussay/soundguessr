import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Anime } from "@/src/types/Anime";
import { Id, toast } from "react-toastify";

let idToast: Id;

export const useAnimes = (page: number) => {
    return useQuery({
        queryKey: ["animes", page],
        queryFn: async () => {
            const res = await fetch("/api/animes?" + new URLSearchParams({ page: String(page) }));
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur inconnue");
            }

            const data: {
                animes: Anime[];
                pages: number;
            } = await res.json();

            return data;
        }
    });
};

export const useAddAnime = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ title, isActive, top100, image }: { title: string, isActive: boolean, top100: boolean, image: File | undefined }) => {
            const res = await fetch(`/api/animes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title,
                    isActive,
                    top100,
                    image: image ? await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(image);
                    }) : null,
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
            toast.update(idToast, { render: "Anime ajouté", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["animes"] });
        },
    })

    return { mutate, isPending };
}

export const useEditAnime = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id, title, isActive, top100, image }: { id: number, title: string, isActive: boolean, top100: boolean, image: File | undefined }) => {
            const res = await fetch(`/api/animes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title,
                    isActive,
                    top100,
                    image: image ? await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(image);
                    }) : null,
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
            toast.update(idToast, { render: "Anime mis à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["animes"] });
        },
    })

    return { mutate, isPending };
}

export const useDeleteAnime = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await fetch(`/api/animes/${id}`, {
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
            toast.update(idToast, { render: "Anime supprimé", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["animes"] });
        },
    })

    return { mutate, isPending };
}

export const useSwitchAnime = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await fetch(`/api/animes/${id}/switch`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
            toast.update(idToast, { render: "Anime mis à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["animes"] });
        },
    })

    return { mutate, isPending };
}