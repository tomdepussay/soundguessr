import React from "react";

interface TableProps {
    children: React.ReactNode;
    position?: "top" | "bottom";
}

function Table({ children, position = "bottom" }: TableProps){
    return (
        <table className={`md:mx-4 border-collapse rounded-md bg-slate-900 caption-${position}`}>
            {children}
        </table>
    )
}

export default Table;