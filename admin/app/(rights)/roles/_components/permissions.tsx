import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Role } from "@/src/types/Role";
import { Permission } from "@/src/types/Permission";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";

interface PermissionsProps {
    role: Role;
}

export function Permissions({ role }: PermissionsProps){

    if(!role.permissions || role.permissions.length === 0) return (
        <Badge variant="destructive">
            Aucune permission
        </Badge> 
    )

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Badge className="cursor-pointer">
                    {role.permissions.length} permission{role.permissions.length > 1? "s" : ""}
                </Badge>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Permissions pour {role.name}</DialogTitle>
                </DialogHeader>
                <ul className="max-h-80 overflow-y-auto">
                    {role.permissions.map((permission) => (
                        <li key={permission.id} className="mb-2">
                            <Card className="py-4">
                                <CardContent>
                                    <span>{permission.name}</span>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Fermer</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}