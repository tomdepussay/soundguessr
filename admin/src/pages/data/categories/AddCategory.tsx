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

interface Category {
    name: string;
    isActive: boolean;
}

type ErrorKeys = 'name';

interface ErrorState {
    name: string;
}

function AddCategory(){

    const { setCurrentPage } = useContext(DataContext);
    const [category, setCategory] = useState<Category>({
        name: "",
        isActive: true
    });
    const [error, setError] = useState<ErrorState>({
        name: ""
    });
    const [status, setStatus] = useState("idle");

    const mutate = useMutation({
        url: "categories",
        method: "PUT",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/categories";
                }, 1000);
            } else {
                toast.error(data.message);
                setStatus("error");
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de l'ajout de la catégorie");
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
    
        setCategory({
            ...category,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (category.name === "") {
            newError.name = "Le nom est obligatoire";
        } else if (category.name.length > 255) {
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

        toast.loading("Ajout de la catégorie en cours...");

        mutate.mutate({ body: category });
        
    };

    useEffect(() => {
        setCurrentPage({
            title: "Ajouter une catégorie",
            Buttons: [
                <Button link={"/data/categories"} color="danger">
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
    }, [status, category, error]);

    return (
        <Form>
            <FormRow>
                <Input label="Nom" error={error.name} name="name" value={category.name} setValue={handleChangeInput} required />
                <Boolean label="Actif" name="isActive" value={category.isActive} setValue={() => setCategory({
                    ...category,
                    isActive: !category.isActive
                })} required />
            </FormRow>
        </Form>
    )
}

export default AddCategory;