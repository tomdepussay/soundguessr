import { useState } from 'react';
import Button from '@components/Button';

interface BooleanProps {
    label: string;
    name: string;
    status?: string;
    required?: boolean;
    value?: boolean;
    setValue?: () => void;
    disabled?: boolean;
    error?: string;
}

function Boolean({ label, name, status = "idle", required = false, value = false, setValue, disabled = false, error = "" }: BooleanProps){
    return (
        <div className="flex-1 flex flex-col gap-1">
            <label className="text-white select-none text-md font-semibold pl-1" htmlFor={name}>
                {label}
                {
                    required && <span className="text-red-500"> *</span>
                }
                {` :`}
            </label>
            <Button
                color={value ? 'success' : 'danger'}
                disabled={status !== "idle" || disabled}
                onClick={() => setValue && setValue()}
            >
                {value ? 'Oui' : 'Non'}
            </Button>
            {
                error && <span className="text-red-500 font-semibold text-sm">{error}</span>
            }
            <input
                name={name}
                id={name}
                type="hidden"
                value={value ? 'true' : 'false'}
            />
        </div>
    )
}

// function Boolean({ label, name, status, required, checked }: BooleanProps){
    
//     const [isChecked, setIsChecked] = useState(checked);

//     const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
//         console.log("click")
//         e.preventDefault();
//         setIsChecked(!isChecked);
//     }
    
//     return (
//         <div className="w-96 flex flex-col gap-1">
//             <label className="text-white select-none text-md" htmlFor={name}>
//                 {label}
//                 {
//                     required && <span className="text-red-500"> *</span>
//                 }
//                 {` :`}
//             </label>
            
//             <Button
//                 color={isChecked ? 'success' : 'danger'}
//                 disabled={status !== "idle"}
//                 onClick={handleClick}
//             >
//                 {isChecked ? 'Oui' : 'Non'}
//             </Button>

//             <input
//                 name={name}
//                 id={name}
//                 type="hidden"
//                 value={isChecked ? 'true' : 'false'}
//             />
//         </div>
//     )
// }

export default Boolean;