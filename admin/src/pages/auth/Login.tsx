import React, { useState, useEffect } from "react";
import Form from "@/components/Form";
import FormRow from "@/components/FormRow";
import Input from "@components/Input";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import useFetch from "@services/useFetch";

function Login() {
    return (
        <div>
            <h2 className="text-white text-center text-4xl">Se connecter</h2>
        </div>
    )
}

export default Login;