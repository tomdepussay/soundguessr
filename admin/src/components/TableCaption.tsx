import React from "react";

interface TableCaptionProps {
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
}

function TableCaption({ children, position = "bottom" }: TableCaptionProps){
    return (
        <caption className="text-white text-lg font-semibold text-start mt-1 ml-1" align={position}>{children}</caption>
    )
}

export default TableCaption;