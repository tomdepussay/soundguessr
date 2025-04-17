"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { AssignForm } from "./_form/assign";
import { Role } from "@/src/types/Role";
import { usePermission } from "@/src/hooks/use-permission";
import { Permission } from "@/src/types/Permission";
import { Permissions } from "./_components/permissions";

interface TableDataProps {
    roles: Role[];
    permissions: Permission[]
}

export default function TableData({ roles, permissions }: TableDataProps){

    const { hasPermission, hasAnyPermission } = usePermission();

    return (
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
                                    <Permissions role={role} />
                                </TableCell>
                            )}
                            {(hasAnyPermission(["admin.rights.roles.assign", "admin.rights.roles.edit", "admin.rights.roles.delete"]) || true) && (
                                <TableCell className="whitespace-nowrap flex gap-1">
                                    {hasPermission("admin.rights.roles.assign") && (
                                        <AssignForm role={role} permissions={permissions} /> 
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