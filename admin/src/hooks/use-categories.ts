import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/src/types/Category";
import { Id, toast } from "react-toastify";

let idToast: Id;

export const useCategories = (page: number) => {
    return useQuery({
        queryKey: ["categories", page],
        queryFn: async () => {
            const res = await fetch("/api/categories?" + new URLSearchParams({ page: String(page) }));
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur inconnue");
            }

            const data: {
                categories: Category[];
                pages: number;
            } = await res.json();

            return data;
        }
    });
};

export const useAddCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ name, isActive }: { name: string, isActive: boolean }) => {
            const res = await fetch(`/api/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name,
                    isActive
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
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Catégorie ajoutée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return { mutate, isPending };
}

export const useEditCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id, name, isActive }: { id: number, name: string, isActive: boolean }) => {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name,
                    isActive
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
            return data;
        },
        onMutate: () => {
            idToast = toast.loading("Modification en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Catégorie modifiée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return { mutate, isPending };
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await fetch(`/api/categories/${id}`, {
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
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Catégorie supprimée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return { mutate, isPending };
}

export const useSwitchCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await fetch(`/api/categories/${id}/switch`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
            return data;
        },
        onMutate: () => {
            idToast = toast.loading("Modification en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Catégorie modifiée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return { mutate, isPending };
}