import React, { useState } from "react";
import Form from "@/components/Form";
import FormRow from "@/components/FormRow";
import Input from "@components/Input";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import useFetch from "@services/useFetch";

function Login() {

    const [show, setShow] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("idle");
    const [error, setError] = useState<string>("");

    const onSubmit = async () => {
        const { data, isError, error, isLoading } = useFetch("");

        console.log(data, isError, error, isLoading);
    }

    return (
        <Form onSubmit={onSubmit}>
            <div className="w-full">
                <h2 className="text-white text-2xl text-center">Se connecter</h2>
            </div>

            <div className="w-full mt-5">
                <div className={`w-4/5 m-auto flex items-center gap-4 p-2 rounded-lg bg-slate-900 shadow-md focus-within:shadow-inner ${status !== "idle" ? 'cursor-not-allowed' : ''}`}>
                    <FaUser className="text-white" />
                    <input
                        autoComplete="off"
                        disabled={status !== "idle"}
                        name="email"
                        id="email"
                        placeholder="Email"
                        type="email"
                        className={`text-white bg-transparent w-full outline-none`}
                    />
                </div>
            </div>

            <div className="w-full mt-5">
                <div className={`w-4/5 m-auto flex items-center gap-4 p-2 rounded-lg bg-slate-900 shadow-md focus-within:shadow-inner ${status !== "idle" ? 'cursor-not-allowed' : ''}`}>
                    <FaLock className="text-white" />
                    <input
                        autoComplete="off"
                        disabled={status !== "idle"}
                        name="password"
                        id="password"
                        placeholder="Mot de passe"
                        type={show ? "text" : "password"}
                        className={`text-white w-full bg-transparent outline-none`}
                    />
                    <button
                       type="button"
                       onClick={() => setShow(!show)}
                    >
                        {
                            show ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />
                        }
                    </button>
                </div>
            </div>

            {
                error && (
                    <div className="w-full mt-5 flex justify-center items-center">
                        <p className="text-red-500">
                            {error}
                        </p>
                    </div>
                )
            }

            <div className="w-full mt-5 flex justify-center items-center">
                <input type="submit" className="bg-slate-900 px-4 py-3 rounded-full text-white shadow-md cursor-pointer hover:bg-slate-950" value="Se connecter" />
            </div>
        </Form>
    )
}

export default Login;