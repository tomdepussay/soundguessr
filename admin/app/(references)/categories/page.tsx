import { hasAccess } from "@/src/lib/session";
import Table from "./Table";
import { AddForm } from "./_form/add";
import { redirect } from "next/navigation";

export default async function Page(){

    const hasPermission = await hasAccess("admin.rights.permissions");

    if(!hasPermission) return redirect("/");

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Catégories</h2>
                {await hasAccess("admin.references.categories.add") && (
                    <AddForm />
                )}
            </div>

            <div className="p-4">
                {await hasAccess("admin.references.categories") && (
                    <Table />
                )}
            </div>
        </div>
    );
}