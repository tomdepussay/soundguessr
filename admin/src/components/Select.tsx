import clsx from "clsx";
import React from "react";
import SelectReact, { MultiValue } from "react-select";

interface SelectProps {
    label?: string;
    name: string;
    groups: Group[];
    required?: boolean;
    multi?: boolean;
    status?: string;
    value?: string | number | string[] | number[];
    setValue?: (event: any) => void;
    displayGroup?: boolean;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
}

function Select({ label, name, groups, required = false, status = "idle", multi= false, value, setValue, disabled = false, displayGroup = false, placeholder = "Sélectionner une valeur", error = "" }: SelectProps){
    return (
        <div className="flex-1 flex flex-col gap-1">
            {
                label && <label className="text-white select-none text-md font-semibold pl-1" htmlFor={name}>
                    {label}
                    {
                        required && <span className="text-red-500"> *</span>
                    }
                    {` :`}
                </label>
            }
            <SelectReact 
                name={name}
                id={name}
                options={groups}
                isMulti={multi}
                classNames={{
                    control: ({ isFocused }) => clsx(
                        "p-2 rounded-lg bg-slate-900 shadow-md text-white border border-slate-600/80",
                        isFocused && "ring ring-blue-600 border-blue-600"
                    ),
                    menu: () => clsx(
                        "bg-slate-900 shadow-md text-white rounded p-2 pt-0",
                    ),
                    option: ({ isFocused }) => clsx(
                        "text-white p-1 rounded",
                        isFocused && "bg-blue-600"
                    ),
                    groupHeading: () => "text-white font-semibold text-md mt-2 mb-0",
                    placeholder: () => "text-slate-100/60",
                    multiValue: () => "bg-blue-600 text-white rounded-lg p-1 mx-1",
                    multiValueLabel: () => "text-white",
                    multiValueRemove: () => "text-white hover:bg-blue-700 rounded-lg p-1",
                }}
                placeholder={placeholder}
                unstyled
                classNamePrefix="react-select" 
                isDisabled={status !== "idle" || disabled}
                value={
                    groups
                        .flatMap(group => group.options)
                        .find(option => option.value === value)
                }
                onChange={(newValue) => {
                    if (newValue && setValue) {
                        if (multi) {
                            setValue({
                                name: name,
                                value: (newValue as MultiValue<Option>).map((option: Option) => option.value),
                            });
                        } else {
                            setValue({
                                name: name,
                                value: (newValue as Option).value,
                            });
                        }
                    } else if (setValue) {
                        setValue({
                            name: name,
                            value: null, // Handle clearing the selection
                        });
                    }
                    // if(multi && newValue && setValue){
                    //     setValue({
                    //         name: name,
                    //         value: newValue.map((option: Option) => option.value),
                    //     });
                    // }
                    // else if (newValue && setValue) {
                    //     setValue({
                    //         name: name,
                    //         value: newValue.value,
                    //     });
                    // } else if (setValue) {
                    //     setValue({
                    //         name: name,
                    //         value: null, // Handle clearing the selection
                    //     });
                    // }
                }}
            />
            {
                error && <span className="text-red-500 mt-1 ml-2 font-semibold text-md">{error}</span>
            }
        </div>
    )
}

export default Select;