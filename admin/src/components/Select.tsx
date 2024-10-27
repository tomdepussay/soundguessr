import React from "react";

interface SelectProps {
    label: string;
    name: string;
    options: Option[];
    required?: boolean;
    status?: string;
    value?: string | number;
    setValue?: (value: string) => void;
    disabled?: boolean;
}

interface Option {
    value: string | number;
    label: string;
}

function Select({ label, name, options, required = false, status = "idle", value, setValue, disabled = false }: SelectProps){
    return (
        <div className="flex-1 flex flex-col gap-1">
            <label className="text-white select-none text-md font-semibold pl-1" htmlFor={name}>
                {label}
                {
                    required && <span className="text-red-500"> *</span>
                }
                {` :`}
            </label>
            <select 
                name={name} 
                id={name} 
                value={value} 
                onChange={(e) => setValue && setValue(e.target.value)} 
                disabled={status !== "idle" || disabled} 
                className={`p-2 rounded-lg bg-slate-900 shadow-md text-white outline-none focus:shadow-inner ${status !== "idle" || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`
            }>
                {
                    options.map((option, index) => {
                        return (
                            <option key={index} value={option.value}>{option.label}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}

export default Select;