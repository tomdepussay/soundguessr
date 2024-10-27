import React from "react";

interface SelectProps {
    label: string;
    name: string;
    groups: Group[];
    required?: boolean;
    status?: string;
    value?: string | number;
    setValue?: (value: string) => void;
    displayGroup?: boolean;
    disabled?: boolean;
}

interface Option {
    label: string;
    value: string | number;
}

interface Group {
    label: string;
    options: Option[];
}

function Select({ label, name, groups, required = false, status = "idle", value, setValue, disabled = false, displayGroup = false }: SelectProps){
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
                    !displayGroup ? (
                        groups.map((group, index) => (
                            group.options.map((option: Option, index: number) => {
                                return (
                                    <option key={index} value={option.value}>{option.label}</option>
                                )
                            })
                        ))
                    ) : (
                        groups.map((group, index) => {
                            return (
                                <optgroup key={index} label={group.label}>
                                    {
                                        group.options.map((option: Option, index: number) => {
                                            return (
                                                <option key={index} value={option.value}>{option.label}</option>
                                            )
                                        })
                                    }
                                </optgroup>
                            )
                        }
                    ))
                }
            </select>
        </div>
    )
}

export default Select;