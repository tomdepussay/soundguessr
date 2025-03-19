import TableData from "./TableData";
import { AddRoleForm } from "./_form/add";

export default async function Page(){
    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Rôles</h2>
                <AddRoleForm />
            </div>

            <div className="p-4">
                <TableData />
            </div>
        </div>
    );
}