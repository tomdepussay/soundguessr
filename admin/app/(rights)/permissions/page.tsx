"use client"

import { useRouter, useSearchParams } from "next/navigation";
import TableData from "./TableData";
import { AddPermissionForm } from "./_form/add";
import { useEffect, useState } from "react";
import Pagination from "@/src/components/Pagination";

export default function Page(){

    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
    const [pages, setPages] = useState(0);
    const [url, setUrl] = useState("");
    
    const handleParams = () => {
        const params = `page=${page}`;
        router.push(`?${params}`, { scroll: false });
        setUrl(params);
    }
    
    useEffect(() => {
        handleParams();
    }, [page]);

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Permissions</h2>
                <AddPermissionForm />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center p-2">
                    <Pagination page={page} setPage={setPage} pages={pages} />
                </div>
                <TableData page={page} setPages={setPages} url={url} />
            </div>
        </div>
    );
}