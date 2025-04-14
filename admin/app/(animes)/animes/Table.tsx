"use client";

import Pagination from "@/src/components/Pagination";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TableData from "./TableData";

export default function Table(){

    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
    const [pages, setPages] = useState(0);
    
    const handleParams = () => {
        const params = `page=${page}`;
        router.push(`?${params}`, { scroll: false });
    }
    
    useEffect(() => {
        handleParams();
    }, [page]);
    
    return (
        <>
            <div className="flex justify-between items-center p-2">
                <Pagination page={page} setPage={setPage} pages={pages} />
            </div>
            <TableData page={page} setPages={setPages} />
        </>
    )
}