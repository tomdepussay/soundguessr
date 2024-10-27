import React from "react";

interface TableHeaderProps {
    children: React.ReactNode;
}

function TableHeader({ children }: TableHeaderProps){
    return (
        <thead>
            <tr className="text-white font-semibold text-base md:text-lg">
                {children}
            </tr>
        </thead>
    )
}

export default TableHeader;