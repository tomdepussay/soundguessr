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

interface Type {
    name: string;
    isActive: boolean;
}

type ErrorKeys = 'name';

interface ErrorState {
    name: string;
}

function AddType(){

    const { setCurrentPage } = useContext(DataContext);
    const [type, setType] = useState<Type>({
        name: "",
        isActive: true
    });
    const [error, setError] = useState<ErrorState>({
        name: ""
    });
    const [status, setStatus] = useState("idle");

    const mutate = useMutation({
        url: "types",
        method: "PUT",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/types";
                }, 1000);
            } else {
                toast.error(data.message);
                setStatus("error");
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de l'ajout du type");
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
    
        setType({
            ...type,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (type.name === "") {
            newError.name = "Le nom est obligatoire";
        } else if (type.name.length > 255) {
            newError.name = "Le nom ne doit pas dépasser 255 caractères";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Ajout du type en cours...");

        mutate.mutate({ body: type });
        
    };

    useEffect(() => {
        setCurrentPage({
            title: "Ajouter un type",
            Buttons: [
                <Button link={"/data/types"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button onClick={handleSubmit} color="success" status={status} icon={<MdAdd />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Ajouter
                    </span>
                </Button>
            ]
        });
    }, [status, type, error]);

    return (
        <Form>
            <FormRow>
                <Input label="Nom" error={error.name} name="name" value={type.name} setValue={handleChangeInput} required />
                <Boolean label="Actif" name="isActive" value={type.isActive} setValue={() => setType({
                    ...type,
                    isActive: !type.isActive
                })} required />
            </FormRow>
        </Form>
    )
}

export default AddType;