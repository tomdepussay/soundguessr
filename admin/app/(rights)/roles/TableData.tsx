"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { EditRoleForm } from "./form.edit";
import { Trash } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useQuery } from "@tanstack/react-query";

type Role = {
    id_role: number;
    name: string;
}

async function fetchRoles(){
    const response = await fetch("/api/roles");
    const data: Role[] = await response.json();
    return data;
}

export default function TableData(){

    const { data: roles, isLoading, error } = useQuery({ queryKey: ["roles"], queryFn: fetchRoles });

    if(isLoading) return <p>Chargement...</p>
    if(error) return <p>Une erreur est survenue</p>

    if(roles) return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        Nom
                    </TableHead>
                    <TableHead className="whitespace-nowrap w-1"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    roles.map(role => (
                        <TableRow key={role.id_role}>
                            <TableCell>{role.name}</TableCell>
                            <TableCell className="whitespace-nowrap flex gap-1">
                                <EditRoleForm role={role} />
                                <Button variant="destructive">
                                    <Trash />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}