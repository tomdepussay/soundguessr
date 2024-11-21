import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import useMutation from "@services/useMutation";
import Button from "@components/Button";
import { AuthContext } from "@services/AuthContext";

function Login() {

    const { user, login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("idle");
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const mutate = useMutation({
        url: "auth/login",
        method: "POST",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                login(data.token.token);
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } else {
                setStatus("error");
                setError(data.message);
            }
        },
        error: (error: any) => {
            setStatus("error");
            setError("Un problème est survenu lors de la connexion");
        }
    })

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");

        if(credentials.email === "" || credentials.password === ""){
            setStatus("error");
            setError("Veuillez remplir tous les champs");
            return;
        }

        mutate.mutate({ body: credentials });
    }
    
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value
        });

        if(status === "error"){
            setStatus("idle");
        }
    }

    return (
        <div>
            <h2 className="text-white text-center text-4xl">Se connecter</h2>

            <form onSubmit={(event) => onSubmit(event)} className="flex flex-col justify-items-center items-center gap-4 mt-4" method="POST">
                <div className="flex items-center gap-3 bg-slate-800 px-3 rounded text-xl w-4/5">
                    <FaUser className="text-white" />
                    <input type="email" name="email" id="email" className="bg-transparent py-2 outline-none text-white w-full" placeholder="Email" value={credentials.email} onChange={onChange} required />
                </div>
                <div className="flex items-center gap-3 bg-slate-800 px-3 rounded text-xl w-4/5">
                    <FaLock className="text-white" />
                    <input type={showPassword ? "text" : "password"} name="password" id="password" className="bg-transparent py-2 outline-none text-white w-full" placeholder="Mot de passe" value={credentials.password} onChange={onChange} required />
                    <button aria-label={showPassword ? "Cacher le mot de passe" : "Voir le mot de passe"} type="button" onClick={(event) => {
                        event.preventDefault();
                        setShowPassword(!showPassword);
                    }}>
                        {
                            showPassword ? <FaEye className="text-white" /> : <FaEyeSlash className="text-white" />
                        }
                    </button>
                </div>
                {
                    status == "error" && (
                        <div>
                            <p className="text-red-500 text-lg font-semibold">{error}</p>
                        </div>
                    )
                }
                <Button label="Se connecter" status={status} color="success" type="submit">
                    <span className="text-xl">
                        Se connecter
                    </span>
                </Button>
            </form>
        </div>
    )
}

export default Login;