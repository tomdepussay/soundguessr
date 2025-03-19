"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditPermissionForm } from "./_form/edit";
import { DeletePermissionForm } from "./_form/delete";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Pagination from "@/src/components/Pagination";
import { FilterButton, Filters, useFilters } from "@/src/components/filter";

type Permission = {
    id_permission: number;
    name: string;
    description: string | null;
}

const fields = [
    {
        name: "ID",
        value: "id_permission",
    },
    {
        name: "Nom",
        value: "name",
    },
    {
        name: "Description",
        value: "description",
    }
]

async function fetchPermissions(page: number) {
    const response = await fetch("/api/permissions?page=" + page);
    const data: {
        permissions: Permission[];
        pages: number;
    } = await response.json();
    return data;
}

export default function TableData(){
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
    const { filters, addFilter, removeFilter } = useFilters();
    const { data, isLoading, error } = useQuery({ 
        queryKey: ["permissions", page], 
        queryFn: () => fetchPermissions(page) 
    });

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        changePage(newPage);
    }

    const changePage = (newPage: number) => {
        router.push(`?page=${newPage}`, { scroll: false });
    };

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>Une erreur est survenue</p>

    if(data && data.pages) {
        if(data.permissions && data.permissions.length === 0) return <p>Aucune permission trouvée</p>

        if(data.permissions && data.pages) return (
            <>
                <div>
                    <Filters filters={filters} />
                </div>
                <div className="flex justify-between items-center p-2">
                    <FilterButton fields={fields} addFilter={addFilter} />
                    <Pagination page={page} setPage={handleChangePage} pages={data.pages} />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="whitespace-nowrap w-1"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.permissions.map(permission => (
                                <TableRow key={permission.id_permission}>
                                    <TableCell>{permission.id_permission}</TableCell>
                                    <TableCell>{permission.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{permission.description ? permission.description : "Aucune description"}</TableCell>
                                    <TableCell className="whitespace-nowrap flex gap-1">
                                        <EditPermissionForm permission={permission} />
                                        <DeletePermissionForm permission={permission} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </>
        )
    } 
}