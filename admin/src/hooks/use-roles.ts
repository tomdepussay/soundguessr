import { useQuery } from "@tanstack/react-query";
import { Role } from "@/src/types/Role";

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
                pages: number;
            } = await res.json();

            return data;
        }
    });
};
