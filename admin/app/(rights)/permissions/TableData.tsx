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

async function fetchPermissions(){
    const response = await fetch("/api/permissions");
    const data: Permission[] = await response.json();
    return data;
}

export default function TableData(){

    const { data: permissions, isLoading, error } = useQuery({ queryKey: ["permissions"], queryFn: fetchPermissions });

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>Une erreur est survenue</p>
    if(permissions && permissions.length === 0) return <p>Aucune permission trouvée</p>

    if(permissions) return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="whitespace-nowrap w-1"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    permissions.map(permission => (
                        <TableRow key={permission.id_permission}>
                            <TableCell>{permission.name}</TableCell>
                            <TableCell>{permission.description ? permission.description : "Aucune description"}</TableCell>
                            <TableCell className="whitespace-nowrap flex gap-1">
                                <EditPermissionForm permission={permission} />
                                <DeletePermissionForm permission={permission} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    ) 
}