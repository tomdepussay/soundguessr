import React from "react";

interface TableRowProps {
    children: React.ReactNode;
    index: number;
}

function TableRow({ index, children }: TableRowProps){
    return (
        <tr className={`${index % 2 == 0 ? "bg-slate-800/70" : ""} text-white text-opacity-90`}>
            {children}
        </tr>
    )
}

export default TableRow;