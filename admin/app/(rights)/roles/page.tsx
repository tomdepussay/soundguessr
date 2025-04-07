import TableData from "./TableData";
import { AddForm } from "./_form/add";
import { hasAccess } from "@/src/lib/session";

export default async function Page(){

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Rôles</h2>
                {await hasAccess("admin.rights.roles.add") && <AddForm />}
            </div>

            <div className="p-4">
                {/* {await hasAccess("admin.rights.roles") && <TableData />} */}
                <TableData
                    EditAccess={await hasAccess("admin.rights.roles.edit")}
                    DeleteAccess={await hasAccess("admin.rights.roles.delete")}
                    AssignAccess={await hasAccess("admin.rights.roles.assign")}
                    IDAccess={await hasAccess("admin.rights.roles.id")}
                    NameAccess={await hasAccess("admin.rights.roles.name")}
                    PermissionsAccess={await hasAccess("admin.rights.roles.permissions")}
                />
            </div>
        </div>
    );
}