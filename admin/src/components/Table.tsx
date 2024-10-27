import React from "react";

interface TableProps {
    children: React.ReactNode;
}

function Table({ children }: TableProps){
    return (
        <table className="md:mx-4 border-collapse rounded-md bg-slate-900">
            {children}
        </table>
    )
}

export default Table;