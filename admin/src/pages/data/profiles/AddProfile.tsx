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

interface Profile {
    name: string;
    description: string;
}

type ErrorKeys = 'name' | 'description';

interface ErrorState {
    name: string;
    description: string;
}

function AddProfile(){

    const { setCurrentPage } = useContext(DataContext);
    const [profile, setProfile] = useState<Profile>({
        name: "",
        description: ""
    });
    const [error, setError] = useState<ErrorState>({
        name: "",
        description: ""
    });
    const [status, setStatus] = useState("idle");

    const mutate = useMutation({
        url: "profiles",
        method: "PUT",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/profiles";
                }, 1000);
            } else {
                toast.error(data.message);
                setStatus("error");
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de l'ajout du profil");
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
    
        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (profile.name === "") {
            newError.name = "Le nom est obligatoire";
        } else if (profile.name.length > 255) {
            newError.name = "Le nom ne doit pas dépasser 255 caractères";
        }

        if (profile.description.length > 255) {
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

        toast.loading("Ajout du profil en cours...");

        mutate.mutate({ body: profile });
        
    };

    useEffect(() => {
        setCurrentPage({
            title: "Ajouter un profil",
            Buttons: [
                <Button link={"/data/profiles"} color="danger">
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
    }, [status, profile, error]);

    return (
        <Form>
            <FormRow>
                <Input label="Nom" error={error.name} name="name" value={profile.name} setValue={handleChangeInput} focus required />
                <Input label="Description" error={error.description} name="description" value={profile.description} setValue={handleChangeInput} />
            </FormRow>
        </Form>
    )
}

export default AddProfile;