interface InputProps {
    label: string;
    name: string;
    required?: boolean;
    status?: string;
    value?: string;
    placeholder?: string;
}

function Input({ label, name, status = "idle", required = false, value, placeholder = "Tapez ici" }: InputProps){
    return (
        <div className="w-96 flex flex-col gap-1">
            <label className="text-white select-none text-md" htmlFor={name}>
                {label}
                {
                    required && <span className="text-red-500"> *</span>
                }
                {` :`}
            </label>
            <input
                autoComplete="off"
                disabled={status !== "idle"}
                name={name}
                id={name}
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                className={`p-2 rounded-lg bg-slate-900 shadow-md text-white outline-none focus:shadow-inner ${status !== "idle" ? 'cursor-not-allowed' : 'cursor-text'}`}
            />
        </div>
    )
}

export default Input;