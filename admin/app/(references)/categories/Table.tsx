"use client";

import Pagination from "@/src/components/Pagination";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TableData from "./TableData";
import { useCategories } from "@/src/hooks/use-categories";

export default function Table(){

    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
    const { data, isLoading, error } = useCategories(page);
    
    useEffect(() => {
        const params = `page=${page}`;
        router.push(`?${params}`, { scroll: false });
    }, [page]);
        
    return (
        <>
            <div className="flex justify-between items-center p-2">
                <Pagination page={page} setPage={setPage} pages={data?.pages} />
            </div>
            {isLoading && <p>Chargement...</p>}
            {error && <p>{error.message}</p>}
            {data && data.categories.length === 0 && <p>Aucune catégorie trouvée</p>}
            {data && data.categories.length > 0 && (
                <TableData categories={data.categories} />
            )}
        </>
    )
}