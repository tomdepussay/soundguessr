import React from "react";

interface TableCellProps {
    children?: React.ReactNode;
    border?: boolean;
    important?: boolean;
}

function TableCell({ children, border, important }: TableCellProps){
    return (
        <td className={`p-2 md:p-4 ${border ? "border-l" : ""} ${!important ? "hidden sm:table-cell" : ""}`}>
            {children}
        </td>
    )
}

export default TableCell;