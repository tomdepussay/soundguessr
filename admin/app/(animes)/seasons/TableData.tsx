"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditForm } from "./_form/edit";
import { DeleteForm } from "./_form/delete";
import { Season } from "@/src/types/Season";
import { usePermission } from "@/src/hooks/use-permission";

type TableDataProps = {
    seasons: Season[];
}

export default function TableData({ seasons }: TableDataProps){
    
    const { hasPermission, hasAnyPermission } = usePermission();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {hasPermission("admin.animes.seasons.id") && (
                        <TableHead>#</TableHead>
                    )}
                    {hasPermission("admin.animes.seasons.name") && (
                        <TableHead>Nom</TableHead>
                    )}
                    {hasAnyPermission(["admin.animes.seasons.edit", "admin.animes.seasons.delete"]) && (
                        <TableHead className="whitespace-nowrap w-1"></TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    seasons.map(season => (
                        <TableRow key={season.id}>
                            {hasPermission("admin.animes.seasons.id") && (
                                <TableCell>{season.id}</TableCell>
                            )}
                            {hasPermission("admin.animes.seasons.name") && (
                                <TableCell>{season.name}</TableCell> 
                            )}
                            {hasAnyPermission(["admin.animes.seasons.edit", "admin.animes.seasons.delete"]) && (
                                <TableCell className="whitespace-nowrap flex gap-1">
                                    {hasPermission("admin.animes.seasons.edit") && (
                                        <EditForm season={season} />
                                    )}
                                    {hasPermission("admin.animes.seasons.delete") && (
                                        <DeleteForm season={season} />
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