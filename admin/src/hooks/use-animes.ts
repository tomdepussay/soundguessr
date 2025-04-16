import { useQuery } from "@tanstack/react-query";
import { Anime } from "@/src/types/Anime";

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
