interface InputProps {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    status?: string;
    value?: string | number;
    setValue?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}

function Input({ label, name, type = "text", status = "idle", required = false, value, setValue, placeholder = "Taper ici", disabled = false, error = "" }: InputProps){
    return (
        <div className={`flex flex-col gap-1`}>
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
                onChange={(e) => setValue && setValue(e)}
                placeholder={placeholder}
                className={`p-2 rounded-lg bg-slate-900 shadow-md text-white outline-none focus:shadow-inner ${error !== "" ? "border-red-500 border-2" : ""} ${status !== "idle" || disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
            />
            {
                error && <span className="text-red-500 mt-1 ml-2 font-semibold text-md">{error}</span>
            }
        </div>
    )
}

export default Input;