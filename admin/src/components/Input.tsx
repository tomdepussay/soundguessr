interface InputProps {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    status?: string;
    value?: string | number;
    setValue?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

function Input({ label, name, type = "text", status = "idle", required = false, value, setValue, placeholder = "Taper ici", disabled = false }: InputProps){
    return (
        <div className="flex flex-col gap1">
            <label className="text-white select-none text-md font-semibold pl-1" htmlFor={name}>
                {label}
                {
                    required && <span className="text-red-500"> *</span>
                }
                {` :`}
            </label>
            <input 
                autoComplete="off"
                type={type}
                disabled={status !== "idle" || disabled}
                name={name}
                id={name}
                value={value}
                onChange={(e) => setValue && setValue(e.target.value)}
                placeholder={placeholder}
                className={`p-2 rounded-lg bg-slate-900 shadow-md text-white outline-none focus:shadow-inner ${status !== "idle" || disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
            />
        </div>
    )
}

export default Input;