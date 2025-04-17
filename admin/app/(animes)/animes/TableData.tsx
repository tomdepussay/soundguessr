"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { Switch } from "./_form/switch";
import { Anime } from "@/src/types/Anime";
import { usePermission } from "@/src/hooks/use-permission";
import { Badge } from "@/src/components/ui/badge";
import { ViewImage } from "./_form/view-image";

type TableDataProps = {
    animes: Anime[];
}

export default function TableData({ animes }: TableDataProps){
    
    const { hasPermission, hasAnyPermission } = usePermission();

    return (
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
                    animes.map(anime => (
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
                            {hasAnyPermission(["admin.animes.animes.image", "admin.animes.animes.edit", "admin.animes.animes.delete"]) && (
                                <TableCell className="whitespace-nowrap flex gap-1">
                                    {hasPermission("admin.animes.animes.image") && (
                                        <ViewImage anime={anime} />
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