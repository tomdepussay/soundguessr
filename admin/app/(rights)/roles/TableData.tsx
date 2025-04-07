"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { AssignForm } from "./_form/assign";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/src/types/Role";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Badge } from "@/src/components/ui/badge";

async function fetchRoles(){
    const response = await fetch("/api/roles");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur inconnue");
    }

    const data: Role[] = await response.json();
    return data;
}

interface TableDataProps{
    EditAccess: boolean
    DeleteAccess: boolean
    AssignAccess: boolean
    IDAccess: boolean
    NameAccess: boolean
    PermissionsAccess: boolean 
}

export default function TableData({ 
    EditAccess,
    DeleteAccess,
    AssignAccess,
    IDAccess,
    NameAccess,
    PermissionsAccess
}: TableDataProps){

    const { data: roles, isLoading, error } = useQuery({ queryKey: ["roles"], queryFn: fetchRoles, retry: false });

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>{error.message}</p>
    if(roles && roles.length === 0) return <p>Aucun rôle trouvé</p>

    if(roles) return (
        <Table>
            <TableHeader>
                <TableRow>
                    {IDAccess && <TableHead>#</TableHead>}
                    {NameAccess && <TableHead>Nom</TableHead>}
                    {PermissionsAccess && <TableHead className="hidden md:table-cell">Permissions</TableHead>}
                    <TableHead className="whitespace-nowrap w-1"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    roles.map(role => (
                        <TableRow key={role.id}>
                            {IDAccess && <TableCell>{role.id}</TableCell>}
                            {NameAccess && <TableCell>{role.name}</TableCell>}
                            {PermissionsAccess && <TableCell className="hidden md:table-cell">
                                {role.permissions && role.permissions.length > 0 ? (
                                    <Popover>
                                        <PopoverTrigger>
                                            <Badge>
                                                {role.permissions.length} permission{role.permissions.length > 1 ? "s" : ""}
                                            </Badge>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <ul>
                                                {role.permissions.map((permission) => (
                                                    <li key={permission.id}>
                                                        {permission.name}
                                                    </li> 
                                                ))}
                                            </ul>
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <Badge variant="destructive">
                                        Aucune permission
                                    </Badge>
                                )}
                            </TableCell>}
                            {(AssignAccess || EditAccess || DeleteAccess) && <TableCell className="whitespace-nowrap flex gap-1">
                                {AssignAccess && <AssignForm role={role} />}
                                {EditAccess && <EditForm role={role} />}
                                {DeleteAccess && <DeleteForm role={role} />}
                            </TableCell>}
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}