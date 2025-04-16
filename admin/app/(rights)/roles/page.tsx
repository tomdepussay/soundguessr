import { redirect } from "next/navigation";
import Table from "./Table";
import { AddForm } from "./_form/add";
import { hasAccess } from "@/src/lib/session";

export default async function Page(){

    const access = await hasAccess("admin.rights.roles");
    if(!access) return redirect("/");

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Rôles</h2>
                {await hasAccess("admin.rights.roles.add") && <AddForm />}
            </div>

            <div className="p-4">
                {await hasAccess("admin.rights.roles") && <Table />}
            </div>
        </div>
    );
}