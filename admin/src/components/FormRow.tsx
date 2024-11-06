import React from "react";

interface FormRowProps {
    children: React.ReactNode;
    separation?: boolean;
}

function FormRow({ children, separation = false }: FormRowProps){
    return (
        <div className="w-full h-fit grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-4">
            {children}
        </div>
    )
}

export default FormRow;