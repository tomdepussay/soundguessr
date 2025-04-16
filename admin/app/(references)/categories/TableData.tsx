"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { Switch } from "./_form/switch";
import { Category } from "@/src/types/Category";
import { usePermission } from "@/src/hooks/use-permission";

type TableDataProps = {
    categories: Category[];
}

export default function TableData({ categories }: TableDataProps){
    
    const { hasPermission, hasAnyPermission } = usePermission();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {hasPermission("admin.references.categories.id") && (
                        <TableHead>#</TableHead>
                    )}
                    {hasPermission("admin.references.categories.name") && (
                        <TableHead>Nom</TableHead>
                    )}
                    {hasPermission("admin.references.categories.isActive") && (
                        <TableHead>Actif</TableHead>
                    )}
                    {hasAnyPermission(["admin.references.categories.edit", "admin.references.categories.delete"]) && (
                        <TableHead className="whitespace-nowrap w-1"></TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    categories.map(category => (
                        <TableRow key={category.id}>
                            {hasPermission("admin.references.categories.id") && (
                                <TableCell>{category.id}</TableCell>
                            )}
                            {hasPermission("admin.references.categories.name") && (
                                <TableCell>{category.name}</TableCell> 
                            )}
                            {hasPermission("admin.references.categories.active") && (
                                <TableCell>
                                    <Switch category={category} />
                                </TableCell>
                            )}
                            {hasAnyPermission(["admin.references.categories.edit", "admin.references.categories.delete"]) && (
                                <TableCell className="whitespace-nowrap flex gap-1">
                                    {hasPermission("admin.references.categories.edit") && (
                                        <EditForm category={category} />
                                    )}
                                    {hasPermission("admin.references.categories.delete") && (
                                        <DeleteForm category={category} />
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