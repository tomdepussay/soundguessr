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

interface Category {
    id: number;
    name: string;
    isActive: boolean;
}

type ErrorKeys = 'name';

interface ErrorState {
    name: string;
}

function EditCategory(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [category, setCategory] = useState<Category>({
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
        name: "category", 
        url: `categories/${id}`
    });

    const mutate = useMutation({
        url: `categories/${id}`,
        method: "PATCH",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/categories";
                }, 1000);
            } else {
                setStatus("error");
                toast.error(data.message);
            }
        },
        error: (error: string) => {
            toast.error(data.message);
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

        toast.loading("Modification de la catégorie en cours...");

        mutate.mutate({ body: category });
    };

    useEffect(() => {
        console.log(data);
        if(data && data.success){
            setCategory(data.category);
            setName(data.category.name);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage({
            title: `Modifier la catégorie : ${name}`,
            Buttons: [
                <Button link={"/data/categories"} color="danger">
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
    }, [status, name, category]);

    return (
        !isLoading && (
            <Form>
                <FormRow>
                    <Input label="ID" name="ID" value={category.id} disabled />
                </FormRow>
                <FormRow>
                    <Input label="Nom" error={error.name} name="name" value={category.name} setValue={handleChangeInput} required />  
                    <Boolean label="Actif" name="isActive" value={category.isActive} setValue={() => setCategory({
                        ...category,
                        isActive: !category.isActive
                    })} required />
                </FormRow>
            </Form>          
        )
    )
}

export default EditCategory;