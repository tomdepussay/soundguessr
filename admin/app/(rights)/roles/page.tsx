import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Edit, Plus, Trash } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Role = {
    id_role: number;
    name: string;
}

export default async function Page(){

    const roles: Role[] = await prisma.roles.findMany({
        select: {
            id_role: true,
            name: true
        }
    });


    return (
        <div>
            <div className="border-b p-3 w-full flex justify-between items-center">
                <h2 className="text-lg font-semibold">Gestion des rôles</h2>
                <Button className="bg-primary text-white">
                    <Plus />
                    Ajouter un rôle
                </Button>
            </div>

            <div className="p-4">
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
                                        <Button>
                                            <Edit />
                                        </Button>
                                        <Button variant="destructive">
                                            <Trash />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}