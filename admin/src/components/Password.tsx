import { useState } from "react";

interface PasswordProps {
    label: string;
    name: string;
    required?: boolean;
    status?: string;
    value?: string;
    left?: boolean;
    right?: boolean;
}

function Password({ label, name, status = "idle", required = false, value, left, right }: PasswordProps){


    return (
        
    )
}

export default Password;