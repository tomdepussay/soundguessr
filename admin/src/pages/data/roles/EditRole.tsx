import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import File from "@components/File";
import { FaArrowLeft } from "react-icons/fa";
import useFetch from "@services/useFetch";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import useMutation from "@services/useMutation";
import Form from "@components/Form";
import FormRow from "@components/FormRow";
import { useParams } from "react-router-dom";

interface Role {
    id: number;
    name: string;
    description: string | null;
}

type ErrorKeys = 'name' | 'description';

interface ErrorState {
    name: string;
    description: string;
}

function EditRole(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [role, setRole] = useState<Role>({
        id: 0,
        name: "",
        description: null
    });
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<ErrorState>({
        name: "",
        description: ""
    });
    const [status, setStatus] = useState("idle");

    const { data, isLoading } = useFetch({ 
        name: "role", 
        url: `roles/${id}`
    });

    const mutate = useMutation({
        url: `roles/${id}`,
        method: "PATCH",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/roles";
                }, 1000);
            } else {
                setStatus("error");
                toast.error(data.message);
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de la modification du rôle");
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
    
        setRole({
            ...role,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (role.name === "") {
            newError.name = "Le nom est obligatoire";
        } else if (role.name.length > 255) {
            newError.name = "Le nom ne doit pas dépasser 255 caractères";
        }

        if (role.description && role.description.length > 255) {
            newError.description = "La description ne doit pas dépasser 255 caractères";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Modification du rôle en cours...");

        mutate.mutate({ body: role });
    };

    useEffect(() => {
        if(data && data.success){
            setRole(data.role);
            setName(data.role.name);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage({
            title: `Modifier le rôle : ${name}`,
            Buttons: [
                <Button label="Retour" link={"/data/roles"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Modifier le rôle" onClick={handleSubmit} color="success" status={status} icon={<MdEdit />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Modifier
                    </span>
                </Button>
            ]
        });
    }, [status, name, role]);

    return (
        !isLoading && (
            <Form>
                <FormRow>
                    <Input label="ID" name="ID" value={role.id} disabled />
                </FormRow>
                <FormRow>
                    <Input label="Nom" error={error.name} name="name" value={role.name} setValue={handleChangeInput} focus required />  
                    <Input label="Description" error={error.description} name="description" value={role.description ? role.description : ""} setValue={handleChangeInput} />
                </FormRow>
            </Form>          
        )
    )
}

export default EditRole;