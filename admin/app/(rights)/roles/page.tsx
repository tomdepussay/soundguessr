import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import TableData from "./TableData";
import Filter from "./Filter";

export default async function Page(){
    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Rôles</h2>
                <Button>
                    <Plus />
                    Ajouter un rôle
                </Button>
            </div>

            <div className="p-4">
                <Filter />
                <TableData />
            </div>
        </div>
    );
}