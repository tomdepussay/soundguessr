"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { useQuery } from "@tanstack/react-query";
import { Permission } from "@/src/types/Permission";
import { Badge } from "@/src/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { usePermissions } from "@/src/hooks/use-permissions";
import { useState } from "react";

interface TableDataProps {
    page: number;
    setPages: (pages: number) => void;
}

export default function TableData({ page, setPages }: TableDataProps){
    
    const { hasPermission, hasAnyPermission } = usePermissions();

    const fetchPermissions = async () => {
        const res = await fetch("/api/permissions?" + new URLSearchParams({ page: String(page) }));

        if(!res.ok){
            const errorData = await res.json();
            throw new Error(errorData.error || "Erreur inconnue");
        }

        const data: {
            permissions: Permission[];
            pages: number;
        } = await res.json();
        
        setPages(data.pages);
        return data;
    }
    
    
    const { data, isLoading, error } = useQuery({ 
        queryKey: ["permissions", page], 
        queryFn: fetchPermissions 
    });

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>{error.message}</p>
    if(data && data.pages) {
        if(data.permissions && data.permissions.length === 0) return <p>Aucune permission trouvée</p>

        if(data.permissions && data.pages) return (
            <>
                
                <Table>
                    <TableHeader>
                        <TableRow>
                            {hasPermission("admin.rights.permissions.id") && (
                                <TableHead>#</TableHead>
                            )}
                            {hasPermission("admin.rights.permissions.name") && (
                                <TableHead>Nom</TableHead>
                            )}
                            {hasPermission("admin.rights.permissions.description") && (
                                <TableHead className="hidden md:table-cell">Description</TableHead>
                            )}
                            {hasPermission("admin.rights.permissions.roles") && (
                                <TableHead className="hidden md:table-cell">Rôles</TableHead>
                            )}
                            {hasAnyPermission(["admin.rights.permissions.edit", "admin.rights.permissions.delete"]) && (
                                <TableHead className="whitespace-nowrap w-1"></TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.permissions.map(permission => (
                                <TableRow key={permission.id}>
                                    {hasPermission("admin.rights.permissions.id") && (
                                        <TableCell>{permission.id}</TableCell>
                                    )}
                                    {hasPermission("admin.rights.permissions.name") && (
                                        <TableCell>{permission.name}</TableCell>
                                    )}
                                    {hasPermission("admin.rights.permissions.description") && (
                                        <TableCell className="hidden md:table-cell">{permission.description ? permission.description : "Aucune description"}</TableCell>
                                    )}
                                    {hasPermission("admin.rights.permissions.roles") && (
                                        <TableCell className="hidden md:table-cell">
                                            {permission.roles && permission.roles.length > 0 ? (
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <Badge>
                                                            {permission.roles.length} rôle{permission.roles.length > 1 ? "s" : ""}
                                                        </Badge>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-fit">
                                                        <span className="text-nowrap">
                                                            {permission.roles.map((role) => role.name).join(", ")}
                                                        </span>
                                                    </PopoverContent>
                                                </Popover>
                                            ) : (
                                                <p>Aucun rôle</p>
                                            )} 
                                        </TableCell>
                                    )}
                                    {hasAnyPermission(["admin.rights.permissions.edit", "admin.rights.permissions.delete"]) && (
                                        <TableCell className="whitespace-nowrap flex gap-1">
                                            {hasPermission("admin.rights.permissions.edit") && (
                                                <EditForm permission={permission} />
                                            )}
                                            {hasPermission("admin.rights.permissions.delete") && (
                                                <DeleteForm permission={permission} />
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </>
        )
    } 
}