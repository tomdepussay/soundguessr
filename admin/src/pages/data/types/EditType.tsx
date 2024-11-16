import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import { FaArrowLeft } from "react-icons/fa";
import useFetch from "@services/useFetch";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import useMutation from "@services/useMutation";
import Form from "@components/Form";
import FormRow from "@components/FormRow";
import { useParams } from "react-router-dom";

interface Type {
    id: number;
    name: string;
    isActive: boolean;
}

type ErrorKeys = 'name';

interface ErrorState {
    name: string;
}

function EditType(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [type, setType] = useState<Type>({
        id: 0,
        name: "",
        isActive: true
    });
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<ErrorState>({
        name: ""
    });
    const [status, setStatus] = useState("idle");

    const { data, isLoading } = useFetch({ 
        name: "type", 
        url: `types/${id}`
    });

    const mutate = useMutation({
        url: `types/${id}`,
        method: "PATCH",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/types";
                }, 1000);
            } else {
                setStatus("error");
                toast.error(data.message);
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de la modification du type");
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

        toast.loading("Modification du type en cours...");

        mutate.mutate({ body: type });
    };

    useEffect(() => {
        console.log(data);
        if(data && data.success){
            setType(data.type);
            setName(data.type.name);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage({
            title: `Modifier le type : ${name}`,
            Buttons: [
                <Button link={"/data/types"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button onClick={handleSubmit} color="success" status={status} icon={<MdEdit />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Modifier
                    </span>
                </Button>
            ]
        });
    }, [status, name, type]);

    return (
        !isLoading && (
            <Form>
                <FormRow>
                    <Input label="ID" name="ID" value={type.id} disabled />
                </FormRow>
                <FormRow>
                    <Input label="Nom" error={error.name} name="name" value={type.name} setValue={handleChangeInput} required />  
                    <Boolean label="Actif" name="isActive" value={type.isActive} setValue={() => setType({
                        ...type,
                        isActive: !type.isActive
                    })} required />
                </FormRow>
            </Form>          
        )
    )
}

export default EditType;