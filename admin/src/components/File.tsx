import { useEffect, useState } from 'react';

interface FileProps {
    label: string;
    name: string;
    status?: string;
    required?: boolean;
}

function File({ label, name, status, required }: FileProps) {
    
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {

            const fileType = selectedFile.type;

            if(fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg'){
                setError("Le fichier doit être une image de type PNG, JPEG ou JPG");
                return;
            } else {
                setError("");
            }

            setFile(selectedFile);
        }
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
            <div className="flex gap-2">
                <div className="w-48 h-48 border-2 border-slate-900 border-dashed relative flex justify-center items-center p-4">
                    <span className='text-white text-center'>
                        Glisser et déposer le fichier ici, ou cliquer pour le sélectionner
                    </span>
                    <input type="file" name={name} disabled={status !== "idle"} className={`w-48 h-48 absolute top-0 left-0 opacity-0 ${status !== "idle" ? "cursor-not-allowed" : "cursor-pointer"}`} onChange={handleChange} accept='.png,.jpeg,.jpg' />
                </div>
                <div className="w-48 h-48 border-2 border-slate-900 border-dashed flex justify-center items-center">
                    {
                        file ? (
                            <img src={URL.createObjectURL(file)} alt={name} className='max-h-44 max-w-44 object-cover' />
                        ) : (
                            <span className='text-white text-center'>
                                Aucun fichier sélectionné
                            </span>
                        )
                    }
                </div>
            </div>
            {
                error && <span className="text-red-500 text-sm">{error}</span>
            }
        </div>
    )
}

export default File;