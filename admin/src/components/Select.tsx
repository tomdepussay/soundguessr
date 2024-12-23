import clsx from "clsx";
import SelectReact from "react-select";

interface SelectProps {
    label?: string;
    name: string;
    groups: Group[];
    required?: boolean;
    status?: string;
    value?: Option;
    setValue?: (event: any) => void;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
}

function Select({ label, name, groups, required = false, status = "idle", value, setValue, disabled = false, placeholder = "Sélectionner une valeur", error = "" }: SelectProps){
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
                    placeholder: () => "text-slate-100/60"
                }}
                placeholder={placeholder}
                unstyled
                classNamePrefix="react-select" 
                isDisabled={status !== "idle" || disabled}
                value={
                    groups
                        .flatMap(group => group.options)
                        .find(option => option.value === value?.value)
                }
                onChange={(newValue) => {
                    setValue && setValue({
                        name: name,
                        value: newValue
                    })
                }}
            />
            {
                error && <span className="text-red-500 mt-1 ml-2 font-semibold text-md">{error}</span>
            }
        </div>
    )
}

export default Select;