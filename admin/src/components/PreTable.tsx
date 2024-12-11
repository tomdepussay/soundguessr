import React from "react";
import Search from "./Search";
import Pagination from "./Pagination";

interface PreTableProps {
    search: string;
    setSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filterMode?: string;
    setFilterMode?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    filterModes?: Group[];
    page: number;
    setPage: (page: number) => void
    totalPages: number;
}

function PreTable({ search, setSearch, filterMode, setFilterMode, filterModes, page, setPage, totalPages }: PreTableProps){
    return (
        <div className="flex justify-center md:justify-between items-center gap-3 p-3 flex-wrap">
            <Search search={search} setSearch={setSearch} filterMode={filterMode} setFilterMode={setFilterMode} filterModes={filterModes} />
            {
                totalPages > 1 && (
                    <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                )
            }
        </div>
    )
}

export default PreTable;