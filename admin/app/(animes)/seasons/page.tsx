import { hasAccess } from "@/src/lib/session";
import Table from "./Table";
import { AddForm } from "./_form/add";
import { redirect } from "next/navigation";

export default async function Page(){

    const hasPermission = await hasAccess("admin.animes.seasons");

    if(!hasPermission) return redirect("/");

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Saisons</h2>
                {await hasAccess("admin.animes.seasons.add") && (
                    <AddForm />
                )}
            </div>

            <div className="p-4">
                {await hasAccess("admin.animes.seasons") && (
                    <Table />
                )}
            </div>
        </div>
    );
}