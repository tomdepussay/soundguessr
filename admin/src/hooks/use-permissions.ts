import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Permission } from "@/src/types/Permission";
import { Role } from "@/src/types/Role";
import { Id, toast } from "react-toastify";

let idToast: Id;

export const usePermissions = (page: number) => {
    return useQuery({
        queryKey: ["permissions", page],
        queryFn: async () => {
            const res = await fetch("/api/permissions?" + new URLSearchParams({ page: String(page) }));
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur inconnue");
            }

            const data: {
                permissions: Permission[];
                roles: Role[];
                pages: number;
            } = await res.json();

            return data;
        }
    });
};

export const useAddPermission = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ name, description, roles }: { name: string, description: string | undefined, roles: string[] | undefined }) => {
            const res = await fetch(`/api/permissions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name,
                    description,
                    roles
                })
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
            toast.update(idToast, { render: "Permission ajoutée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });

    return { mutate, isPending };
}

export const useEditPermission = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id, name, description, roles }: { id: number, name: string, description: string | undefined, roles: string[] | undefined }) => {
            const res = await fetch(`/api/permissions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name,
                    description,
                    roles
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
            toast.update(idToast, { render: "Permission mise à jour", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });

    return { mutate, isPending };
}

export const useDeletePermission = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await fetch(`/api/permissions/${id}`, {
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
            toast.update(idToast, { render: "Permission supprimée", type: "success", isLoading: false, autoClose: 2000 });
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });

    return { mutate, isPending };
}