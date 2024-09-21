import { useState } from 'react';
import Button from '@components/Button';

interface BooleanProps {
    label: string;
    name: string;
    status?: string;
    required?: boolean;
    checked?: boolean;
}

function Boolean({ label, name, status, required, checked }: BooleanProps){
    
    const [isChecked, setIsChecked] = useState(checked);

    const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
        console.log("click")
        e.preventDefault();
        setIsChecked(!isChecked);
    }
    
    return (
        <div className="w-96 flex flex-col gap-1">
            <label className="text-white select-none text-md" htmlFor={name}>
                {label}
                {
                    required && <span className="text-red-500"> *</span>
                }
                {` :`}
            </label>
            
            <Button
                color={isChecked ? 'success' : 'danger'}
                disabled={status !== "idle"}
                onClick={handleClick}
            >
                {isChecked ? 'Oui' : 'Non'}
            </Button>

            <input
                name={name}
                id={name}
                type="hidden"
                value={isChecked ? 'true' : 'false'}
            />
        </div>
    )
}

export default Boolean;