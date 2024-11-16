import React from "react";
import { MdClose } from "react-icons/md";
import Button from "./Button";

interface AlertProps {
    message: string;
    onClick: () => void;
    hideAlert: () => void;
}

function Alert({ message, onClick, hideAlert }: AlertProps){
    return (
        <div className="w-screen h-screen absolute top-0 left-0 d-flex justify-center items-center">
            <div className="w-full h-full bg-black bg-opacity-50 absolute top-0 left-0 z-50"></div>
            <div className="relative z-50 w-full h-full flex justify-center items-center">
                <div className="w-1/3 bg-slate-800 rounded-3xl shadow-lg p-12">
                    <div className="w-full text-white text-center text-xl font-semibold">
                        {message}
                    </div>
                    <div className="w-full flex justify-center items-center gap-4 mt-8">
                        <Button color="success" onClick={onClick}>
                            <span className="font-semibold text-xl">
                                Oui
                            </span>
                        </Button>
                        <Button color="danger" onClick={hideAlert}>
                            <span className="font-semibold text-xl">
                                Non
                            </span>
                        </Button>                            
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Alert;