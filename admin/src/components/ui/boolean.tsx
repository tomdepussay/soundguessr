import { Button } from "./button";
import { useState } from "react";

interface BooleanProps {
    name: string;
    id: string;
    defaultValue?: boolean;
    disabled?: boolean;
}

export function Boolean({ name, id, defaultValue = false, disabled = false }: BooleanProps) {

    const [checked, setChecked] = useState(defaultValue);

    const handleClick = () => {
        setChecked(!checked);
        const input = document.getElementById(id) as HTMLInputElement;
        input.value = checked ? "0" : "1";
    }

    return (
        <>
            <Button type="button" variant={checked ? "default" : "destructive"} onClick={handleClick} disabled={disabled}>
                {checked ? "Oui" : "Non"}
            </Button>
            <input type="hidden" name={name} id={id} value={checked ? "1" : "0"} />
        </>
    )
}