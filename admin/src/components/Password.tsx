import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordProps {
    label: string;
    name: string;
    required?: boolean;
    status?: string;
    value?: string;
    left?: boolean;
    right?: boolean;
}

function Password({ label, name, status = "idle", required = false, value, left, right }: PasswordProps){

    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="w-96 flex flex-col gap-1">
            <label className="text-white select-none text-md" htmlFor={name}>
                {label}
                {
                    required && <span className="text-red-500"> *</span>
                }
                {` :`}
            </label>
            <div className={`flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-900 shadow-md focus-within:shadow-inner ${status !== "idle" ? 'cursor-not-allowed' : ''}`}>
                {
                    left && <button
                        type="button"
                        className="absolute right-2 top-2"
                        onClick={() => setShow(!show)}
                    >
                        {
                            show ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />
                        }
                    </button>
                }
                <input
                    autoComplete="off"
                    disabled={status !== "idle"}
                    name={name}
                    id={name}
                    type={show ? "text" : "password"}
                    defaultValue={value}
                    className={`text-white bg-transparent outline-none`}
                />
                {
                    right && <button
                        type="button"
                        className=""
                        onClick={() => setShow(!show)}
                    >
                        {
                            show ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />
                        }
                    </button>
                }
            </div>
            
        </div>
    )
}

export default Password;