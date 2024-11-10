import React from "react";

interface FormRowProps {
    children: React.ReactNode;
    separation?: boolean;
}

function FormRow({ children, separation = false }: FormRowProps){
    return (
        <div className="w-full h-fit grid gap-4 grid-cols-1 md:grid-cols-3 mb-4">
            {children}
        </div>
    )
}

export default FormRow;