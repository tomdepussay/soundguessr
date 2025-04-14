"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { Switch } from "./_form/switch";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/src/types/Category";
import { usePermissions } from "@/src/hooks/use-permissions";

type TableDataProps = {
    page: number;
    setPages: (pages: number) => void;
}

export default function TableData({ page, setPages }: TableDataProps){
    
    const { hasPermission, hasAnyPermission } = usePermissions();

    const fetchCategories = async () => {
        const res = await fetch("/api/categories?" + new URLSearchParams({ page: String(page) }));

        if(!res.ok){
            const errorData = await res.json();
            throw new Error(errorData.error || "Erreur inconnue");
        }

        const data: {
            categories: Category[];
            pages: number;
        } = await res.json();

        setPages(data.pages);
        return data;
    }
    
    const { data, isLoading, error } = useQuery({ 
        queryKey: ["categories", page], 
        queryFn: fetchCategories 
    });

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>{error.message}</p>
    if(data && data.pages) {
        if(data.categories && data.categories.length === 0) return <p>Aucune catégorie trouvée</p>

        if(data.categories && data.pages) return (
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
                        data.categories.map(category => (
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
}