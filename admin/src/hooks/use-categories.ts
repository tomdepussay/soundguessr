import { useQuery } from "@tanstack/react-query";
import { Category } from "@/src/types/Category";

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
