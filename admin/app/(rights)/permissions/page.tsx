import { redirect } from "next/navigation";
import Table from "./Table";
import { AddForm } from "./_form/add";
import { hasAccess } from "@/src/lib/session";
import prisma from "@/src/lib/prisma";

export default async function Page(){

    const hasPermission = await hasAccess("admin.rights.permissions");

    if(!hasPermission) return redirect("/");

    const roles = await prisma.role.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            id: "asc"
        }
    })

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Permissions</h2>
                {await hasAccess("admin.rights.permissions.add") && (
                    <AddForm roles={roles} />
                )}
            </div>

            <div className="p-4">
                {await hasAccess("admin.rights.permissions") && (
                    <Table />
                )}
            </div>
        </div>
    );
}