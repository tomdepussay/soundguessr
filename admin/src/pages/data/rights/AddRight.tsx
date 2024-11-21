import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import { FaArrowLeft } from "react-icons/fa";
import useFetch from "@services/useFetch";
import { MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import useMutation from "@services/useMutation";
import Form from "@components/Form";
import FormRow from "@components/FormRow";
import File from "@components/File";

interface Right {
    name: string;
    code: string;
}

type ErrorKeys = 'name' | 'code';

interface ErrorState {
    name: string;
    code: string;
}

function AddRight(){

    const { setCurrentPage } = useContext(DataContext);
    const [right, setRight] = useState<Right>({
        name: "",
        code: ""
    });
    const [error, setError] = useState<ErrorState>({
        name: "",
        code: ""
    });
    const [status, setStatus] = useState("idle");

    const mutate = useMutation({
        url: "rights",
        method: "PUT",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/rights";
                }, 1000);
            } else {
                toast.error(data.message);
                setStatus("error");
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de l'ajout du droit");
            console.log(error);
        }
    })

    const handleErrors = (name: string) => {
        if (error[name as ErrorKeys] !== "") {
            setError({
                ...error,
                [name]: ""
            });
          setStatus("idle");
        }
    };

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleErrors(name);
    
        setRight({
            ...right,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (right.name === "") {
            newError.name = "Le nom est obligatoire";
        } else if (right.name.length > 255) {
            newError.name = "Le nom ne doit pas dépasser 255 caractères";
        }
        
        if (right.code === "") {
            newError.code = "Le code est obligatoire";
        } else if (right.code.length > 255) {
            newError.code = "Le code ne doit pas dépasser 255 caractères";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Ajout du droit en cours...");

        mutate.mutate({ body: right });
        
    };

    useEffect(() => {
        setCurrentPage({
            title: "Ajouter un droit",
            Buttons: [
                <Button label="Retour" link={"/data/rights"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Ajouter un droit" onClick={handleSubmit} color="success" status={status} icon={<MdAdd />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Ajouter
                    </span>
                </Button>
            ]
        });
    }, [status, right, error]);

    return (
        <Form>
            <FormRow>
                <Input label="Nom" error={error.name} name="name" value={right.name} setValue={handleChangeInput} focus required />
                <Input label="Code" error={error.code} name="code" value={right.code} setValue={handleChangeInput} required />
            </FormRow>
        </Form>
    )
}

export default AddRight;