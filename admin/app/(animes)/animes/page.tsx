import { hasAccess } from "@/src/lib/session";
import Table from "./Table";
import { AddForm } from "./_form/add";
import { redirect } from "next/navigation";
import { deleteImage } from "@/src/lib/image";
import Test from "./_form/test";

export default async function Page(){

    const hasPermission = await hasAccess("admin.animes.animes");

    if(!hasPermission) return redirect("/");

    deleteImage("215cf211-2ce9-4997-af54-08d62ed4d5ea");

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Animes</h2>
                {await hasAccess("admin.animes.animes.add") && (
                    <AddForm />
                )}
            </div>

            <div className="p-4">
                {await hasAccess("admin.animes.animes") && (
                    <Table />
                )}
            </div>
        </div>
    );
}