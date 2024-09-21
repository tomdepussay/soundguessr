import React, { useState } from "react";
import Form from "@/components/Form";
import FormRow from "@/components/FormRow";
import Input from "@components/Input";
import Password from "@components/Password";

function Login() {

    const [status, setStatus] = useState<string>("idle");

    return (
        <Form>
            <div className="w-full flex gap-10 items-center justify-center">
                <h2 className="text-white text-2xl">Se connecter</h2>
            </div>

            <FormRow center>
                <Input label="Email" name="email" status={status} required placeholder="Veuillez entrer votre email"/>
            </FormRow>
            <FormRow center>
                <Password label="Mot de passe" name="password" status={status} required right />
            </FormRow>
        </Form>
    )
}

export default Login;