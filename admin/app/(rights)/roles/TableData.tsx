"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { AssignForm } from "./_form/assign";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/src/types/Role";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Badge } from "@/src/components/ui/badge";
import { usePermissions } from "@/src/hooks/use-permissions";

async function fetchRoles(){
    const res = await fetch("/api/roles");

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur inconnue");
    }

    const data: Role[] = await res.json();
    return data;
}

export default function TableData(){

    const { data: roles, isLoading, error } = useQuery({ queryKey: ["roles"], queryFn: fetchRoles, retry: false });
    const { hasPermission, hasAnyPermission } = usePermissions();

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>{error.message}</p>
    if(roles && roles.length === 0) return <p>Aucun rôle trouvé</p>

    if(roles) return (
        <Table>
            <TableHeader>
                <TableRow>
                    {hasPermission("admin.rights.roles.id") && (
                        <TableHead>#</TableHead>
                    )}
                    {hasPermission("admin.rights.roles.name") && (
                        <TableHead>Nom</TableHead>
                    )}
                    {hasPermission("admin.rights.roles.permissions") && (
                        <TableHead className="hidden md:table-cell">Permissions</TableHead>
                    )}
                    {hasAnyPermission(["admin.rights.roles.assign", "admin.rights.roles.edit", "admin.rights.roles.delete"]) && (
                        <TableHead className="whitespace-nowrap w-1"></TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    roles.map(role => (
                        <TableRow key={role.id}>
                            {hasPermission("admin.rights.roles.id") && (
                                <TableCell>{role.id}</TableCell>
                            )}
                            {hasPermission("admin.rights.roles.name") && (
                                <TableCell>{role.name}</TableCell>
                            )}
                            {hasPermission("admin.rights.roles.permissions") && (
                                <TableCell className="hidden md:table-cell">
                                    {role.permissions && role.permissions.length > 0? (
                                        <Popover>
                                            <PopoverTrigger>
                                                <Badge>
                                                    {role.permissions.length} permission{role.permissions.length > 1? "s" : ""}
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
                                </TableCell>
                            )}
                            {(hasAnyPermission(["admin.rights.roles.assign", "admin.rights.roles.edit", "admin.rights.roles.delete"]) || true) && (
                                <TableCell className="whitespace-nowrap flex gap-1">
                                    {hasPermission("admin.rights.roles.assign") && (
                                        <AssignForm role={role} /> 
                                    )}
                                    {hasPermission("admin.rights.roles.edit") && (
                                        <EditForm role={role} /> 
                                    )}
                                    {hasPermission("admin.rights.roles.delete") && (
                                        <DeleteForm role={role} /> 
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}