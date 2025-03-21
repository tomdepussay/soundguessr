import TableData from "./TableData";
import { AddForm } from "./_form/add";

export default async function Page(){
    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Rôles</h2>
                <AddForm />
            </div>

            <div className="p-4">
                <TableData />
            </div>
        </div>
    );
}