interface FileProps {
    label: string;
    name: string;
    status?: "idle" | "loading" | "success" | "error";
    required?: boolean;
    value?: File | null;
    setValue?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: string;
}

function File({ label, name, status = "idle", required = false, value, setValue, disabled = false, error = "" }: FileProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-white select-none text-md font-semibold pl-1" htmlFor={name}>
                {label}
                {
                    required && <span className="text-red-500"> *</span>
                }
                {` :`}
            </label>
            <div className="flex gap-2">
                <div className="w-48 h-48 border-2 border-slate-900 border-dashed relative flex justify-center items-center p-4">
                    <span className='text-white text-center'>
                        Glisser et déposer le fichier ici, ou cliquer pour le sélectionner
                    </span>
                    <input type="file" name={name} disabled={status !== "idle"} className={`w-48 h-48 absolute top-0 left-0 opacity-0 ${status !== "idle" ? "cursor-not-allowed" : "cursor-pointer"}`} onChange={setValue} accept='.png,.jpeg,.jpg' />
                </div>
                <div className="w-48 h-48 border-2 border-slate-900 border-dashed flex justify-center items-center">
                    {
                        value ? (
                            <img src={URL.createObjectURL(value)} alt={name} className='max-h-44 max-w-44 object-cover' />
                        ) : (
                            <span className='text-white text-center'>
                                Aucun fichier sélectionné
                            </span>
                        )
                    }
                </div>
            </div>
            {
                error && <span className="text-red-500 mt-1 ml-2 font-semibold text-md">{error}</span>
            }
        </div>
    )
}

export default File;