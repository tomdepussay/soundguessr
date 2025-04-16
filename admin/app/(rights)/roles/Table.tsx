"use client";

import Pagination from "@/src/components/Pagination";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TableData from "./TableData";
import { useRoles } from "@/src/hooks/use-roles";

export default function Table(){

    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
    const { data, isLoading, error } = useRoles(page);
    
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
            {data && data.roles.length === 0 && <p>Aucun rôle trouvé</p>}
            {data && data.roles.length > 0 && (
                <TableData roles={data.roles} />
            )}
        </>
    )
}