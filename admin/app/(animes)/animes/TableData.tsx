"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { Switch } from "./_form/switch";
import { useQuery } from "@tanstack/react-query";
import { Anime } from "@/src/types/Anime";
import { usePermissions } from "@/src/hooks/use-permissions";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

type TableDataProps = {
    page: number;
    setPages: (pages: number) => void;
}

export default function TableData({ page, setPages }: TableDataProps){
    
    const { hasPermission, hasAnyPermission } = usePermissions();

    const fetchAnimes = async () => {
        const res = await fetch("/api/animes?" + new URLSearchParams({ page: String(page) }));

        if(!res.ok){
            const errorData = await res.json();
            throw new Error(errorData.error || "Erreur inconnue");
        }

        const data: {
            animes: Anime[];
            pages: number;
        } = await res.json();

        setPages(data.pages);
        return data;
    }
    
    const { data, isLoading, error } = useQuery({ 
        queryKey: ["animes", page], 
        queryFn: fetchAnimes 
    });

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>{error.message}</p>
    if(data && data.pages != undefined) {
        if(data.animes && data.animes.length === 0) return <p>Aucun anime trouvé</p>

        if(data.animes && data.pages) return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {hasPermission("admin.animes.animes.id") && (
                            <TableHead>#</TableHead>
                        )}
                        {hasPermission("admin.animes.animes.title") && (
                            <TableHead>Titre</TableHead>
                        )}
                        {hasPermission("admin.animes.animes.top100") && (
                            <TableHead>Top 100</TableHead>
                        )}
                        {hasPermission("admin.animes.animes.isActive") && (
                            <TableHead>Actif</TableHead>
                        )}
                        {hasAnyPermission(["admin.animes.animes.edit", "admin.animes.animes.delete"]) && (
                            <TableHead className="whitespace-nowrap w-1"></TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data.animes.map(anime => (
                            <TableRow key={anime.id}>
                                {hasPermission("admin.animes.animes.id") && (
                                    <TableCell>{anime.id}</TableCell>
                                )}
                                {hasPermission("admin.animes.animes.title") && (
                                    <TableCell>{anime.title}</TableCell> 
                                )}
                                {hasPermission("admin.animes.animes.top100") && (
                                    <TableCell>
                                        <Badge variant={anime.top100 ? "default" : "secondary"}>
                                            {anime.top100 ? "Oui" : "Non"}
                                        </Badge>
                                    </TableCell>
                                )}
                                {hasPermission("admin.animes.animes.isActive") && (
                                    <TableCell>
                                        <Switch anime={anime} />
                                    </TableCell>
                                )}
                                {hasAnyPermission(["admin.animes.animes.edit", "admin.animes.animes.delete"]) && (
                                    <TableCell className="whitespace-nowrap flex gap-1">
                                        {hasPermission("admin.animes.animes.image") && (
                                            <Button>
                                                I
                                            </Button>
                                        )}
                                        {hasPermission("admin.animes.animes.edit") && (
                                            <EditForm anime={anime} />
                                        )}
                                        {hasPermission("admin.animes.animes.delete") && (
                                            <DeleteForm anime={anime} />
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