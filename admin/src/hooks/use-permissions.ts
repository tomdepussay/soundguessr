import { useQuery } from "@tanstack/react-query";
import { Permission } from "@/src/types/Permission";

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
                pages: number;
            } = await res.json();

            return data;
        }
    });
};
