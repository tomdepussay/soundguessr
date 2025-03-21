"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { Switch } from "./_form/switch";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/src/components/ui/badge";

type Category = {
    id_category: number;
    name: string;
    is_active: boolean;
}

type TableDataProps = {
    page: number;
    setPages: (pages: number) => void;
}

export default function TableData({ page, setPages }: TableDataProps){

    const fetchCategories = async () => {
        const response = await fetch("/api/categories?" + new URLSearchParams({ page: String(page) }));
        const data: {
            categories: Category[];
            pages: number;
        } = await response.json();
        setPages(data.pages);
        console.log(data);
        return data;
    }
    
    const { data, isLoading, error } = useQuery({ 
        queryKey: ["categories", page], 
        queryFn: fetchCategories 
    });

    if(error) return <p>Une erreur est survenue</p>
    if(data && data.pages) {
        if(data.categories && data.categories.length === 0) return <p>Aucune catégorie trouvée</p>

        if(data.categories && data.pages) return (
            <>
                
                {
                    isLoading ? 
                    <p>Chargement...</p> :
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Actif</TableHead>
                                <TableHead className="whitespace-nowrap w-1"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data.categories.map(category => (
                                    <TableRow key={category.id_category}>
                                        <TableCell>{category.id_category}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>
                                            {/* <Badge variant={category.is_active ? "default" : "destructive"}>
                                                {category.is_active ? "Oui" : "Non"}
                                            </Badge> */}
                                            <Switch category={category} />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap flex gap-1">
                                            <EditForm category={category} />
                                            <DeleteForm category={category} />
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