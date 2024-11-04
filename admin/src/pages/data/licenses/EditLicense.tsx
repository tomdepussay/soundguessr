import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import { FaArrowLeft } from "react-icons/fa";
import useFetch from "@services/useFetch";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import useMutation from "@services/useMutation";
import Form from "@components/Form";
import { useParams } from "react-router-dom";

interface License {
    id: number;
    title: string;
    path: string;
    top100: boolean;
    isActive: boolean;
    categoryId: number;
}

type ErrorKeys = 'title' | 'categoryId';

interface ErrorState {
    title: string;
    categoryId: string;
}

function EditLicense(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [license, setLicense] = useState<License>({
        id: 0,
        title: "",
        path: "",
        top100: true,
        isActive: true,
        categoryId: 0
    });
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<ErrorState>({
        title: "",
        categoryId: "",
    });
    const [status, setStatus] = useState("idle");
    const [categories, setCategories] = useState<Group[]>([]);

    const { data, isLoading } = useFetch({ 
        name: "categoryAdd", 
        url: `licenses/add`
    });

    const { data: licenseData, isLoading: licenseLoading } = useFetch({ 
        name: "license", 
        url: `licenses/${id}` 
    });

    const mutate = useMutation({
        url: `licenses/${id}`,
        method: "PATCH",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success("La licence a été modifiée avec succès");
                setTimeout(() => {
                    window.location.href = "/data/licenses";
                }, 1000);
            }
        },
        error: (error: string) => {
            toast.error("Une erreur est survenue lors de la modification de la licence");
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
    
        setLicense({
            ...license,
            [name]: value
        });
    };

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        handleErrors(name);
    
        setLicense({
            ...license,
            [name]: parseInt(value)
        });
    }

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (license.title === "") {
            newError.title = "Le titre est obligatoire";
        } else if (license.title.length > 255) {
            newError.title = "Le titre ne doit pas dépasser 255 caractères";
        }

        if (license.categoryId === 0) {
            newError.categoryId = "La catégorie est obligatoire";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Modification de la licence en cours...");

        setLicense((prevLicense) => {
            mutate.mutate({body: {
                title: license.title,
                categoryId: license.categoryId,
                isActive: license.isActive
            }});
            return prevLicense;
        })
        
    };

    useEffect(() => {
        if(data && data.success){
            setCategories(data.categories);
        }
    }, [data]);

    useEffect(() => {
        if(licenseData && licenseData.success){
            setLicense(licenseData.license);
            setTitle(licenseData.license.title);
        }
    }, [licenseData]);

    useEffect(() => {
        setCurrentPage({
            title: `Modifier la licence : ${title}`,
            Buttons: [
                <Button link={"/data/licenses"} color="danger">
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
    }, [status, title]);

    return (
        !isLoading && !licenseLoading && (
            <Form>
                <Input label="ID" name="ID" value={license.id} disabled />
                <Input label="Titre" error={error.title} name="title" value={license.title} setValue={handleChangeInput} required />
                <Input label="Chemin d'accès" name="path" value={license.path} disabled />
                <Boolean label="Top 100" name="top100" value={license.top100} setValue={() => setLicense({
                    ...license,
                    top100: !license.top100
                })} required />
                <Boolean label="Actif" name="isActive" value={license.isActive} setValue={() => setLicense({
                    ...license,
                    isActive: !license.isActive
                })} required />
                <Select 
                    label="Catégorie" 
                    name="categoryId" 
                    error={error.categoryId} 
                    groups={categories} 
                    placeholder="Sélectionner une catégorie" 
                    value={license.categoryId} 
                    setValue={handleChangeSelect} 
                    required 
                />
            </Form>          
        )
    )
}

export default EditLicense;