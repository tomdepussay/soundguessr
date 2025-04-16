import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Role } from "@/src/types/Role";
import { Permission } from "@/src/types/Permission";
import { Id, toast } from "react-toastify";

let idToast: Id;

export const useRoles = (page: number) => {
    return useQuery({
        queryKey: ["roles", page],
        queryFn: async () => {
            const res = await fetch("/api/roles?" + new URLSearchParams({ page: String(page) }));
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur inconnue");
            }

            const data: {
                roles: Role[];
                permissions: Permission[];
                pages: number;
            } = await res.json();

            return data;
        }
    });
};

export const useAddRole = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ name }: { name: string }) => {
            const res = await fetch(`/api/roles`, {
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
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Rôle ajouté", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });

    return { mutate, isPending };
}

export const useEditRole = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id, name }: { id: number, name: string }) => {
            const res = await fetch(`/api/roles/${id}`, {
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
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Rôle mis à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });

    return { mutate, isPending };
}

export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await fetch(`/api/roles/${id}`, {
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
            toast.update(idToast, { render: "Rôle supprimé", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });

    return { mutate, isPending };
}

export const useAssignRole = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ roleId, permissionIds }: { roleId: number, permissionIds: number[] }) => {
            const res = await fetch(`/api/roles/${roleId}/assign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    permissionIds
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
            return data;
        },
        onMutate: () => {
            idToast = toast.loading("Mise à jour en cours...", { type: "info" });
        },
        onError: (error) => {
            toast.update(idToast, { render: error.message, type: "error", isLoading: false });
        },
        onSuccess: () => {
            toast.update(idToast, { render: "Rôle mis à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    })

    return { mutate, isPending };
}