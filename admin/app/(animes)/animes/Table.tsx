"use client";

import Pagination from "@/src/components/Pagination";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TableData from "./TableData";
import { useAnimes } from "@/src/hooks/use-animes";

export default function Table(){

    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
    const { data, isLoading, error } = useAnimes(page);
    
    useEffect(() => {
        const params = `page=${page}`;
        router.push(`?${params}`, { scroll: false });
    }, [page]);
   
    if(!data) return (
        <p>Erreur de chargement</p>
    )
    
    return (
        <>
            <div className="flex justify-between items-center p-2">
                <Pagination page={page} setPage={setPage} pages={data.pages} />
            </div>
            {isLoading && <p>Chargement...</p>}
            {error && <p>{error.message}</p>}
            {data && data.animes.length === 0 && <p>Aucun anime trouvé</p>}
            {data && data.animes.length > 0 && (
                <TableData animes={data.animes} />
            )}
        </>
    )
}