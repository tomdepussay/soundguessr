"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditPermissionForm } from "./_form/edit";
import { DeletePermissionForm } from "./_form/delete";
import { useQuery } from "@tanstack/react-query";

type Permission = {
    id_permission: number;
    name: string;
    description: string | null;
}

type TableDataProps = {
    page: number;
    setPages: (pages: number) => void;
}

export default function TableData({ page, setPages }: TableDataProps){

    const fetchPermissions = async () => {
        const response = await fetch("/api/permissions?" + new URLSearchParams({ page: String(page) }));
        const data: {
            permissions: Permission[];
            pages: number;
        } = await response.json();
        setPages(data.pages);
        return data;
    }
    
    const { data, isLoading, error } = useQuery({ 
        queryKey: ["permissions", page], 
        queryFn: fetchPermissions 
    });

    if(error) return <p>Une erreur est survenue</p>
    if(data && data.pages) {
        if(data.permissions && data.permissions.length === 0) return <p>Aucune permission trouvée</p>

        if(data.permissions && data.pages) return (
            <>
                
                {
                    isLoading ? 
                    <p>Chargement...</p> :
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
                }
            </>
        )
    } 
}