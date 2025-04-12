import { redirect } from "next/navigation";
import Table from "./Table";
import { AddForm } from "./_form/add";
import { hasAccess } from "@/src/lib/session";

export default async function Page(){

    const hasPermission = await hasAccess("admin.rights.permissions");

    if(!hasPermission) return redirect("/");

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Permissions</h2>
                {await hasAccess("admin.rights.permissions.add") && (
                    <AddForm />
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