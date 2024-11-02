import React from "react";

interface TableCaptionProps {
    children: React.ReactNode;
}

function TableCaption({ children }: TableCaptionProps){
    return (
        <caption className="text-white text-lg font-semibold text-start mt-1 ml-1">
            {children}
        </caption>
    )
}

export default TableCaption;