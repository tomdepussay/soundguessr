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

interface License {
    id: number;
    title: string;
    path: string;
    picture: string;
    top100: boolean;
    isActive: boolean;
    categoryId: number;
}

type ErrorKeys = 'title' | 'categoryId' | 'file';

interface ErrorState {
    title: string;
    categoryId: string;
    file: string;
}

function EditLicense(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [license, setLicense] = useState<License>({
        id: 0,
        title: "",
        path: "",
        picture: "",
        top100: true,
        isActive: true,
        categoryId: 0
    });
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<ErrorState>({
        title: "",
        categoryId: "",
        file: ""
    });
    const [file, setFile] = useState<File | null>(null);
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
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/licenses";
                }, 1000);
            } else {
                setStatus("error");
                toast.error(data.message);
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de la modification de la licence");
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

    const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        handleErrors("file");

        if(files && files.length > 0){
            const selectedFile = files[0];
            const fileType = selectedFile.type;

            if(fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg'){
                setError({
                    ...error,
                    file: "Le fichier doit être une image de type PNG, JPEG ou JPG"
                });
                return;
            } else {
                setError({
                    ...error,
                    file: ""
                });
            }

            setFile(selectedFile);
        }
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

            const formData = new FormData();
            formData.append("title", prevLicense.title);
            formData.append("categoryId", prevLicense.categoryId.toString());
            formData.append("top100", prevLicense.top100.toString());
            formData.append("isActive", prevLicense.isActive.toString());
            
            setFile((prevFile) => {
                if(prevFile){
                    formData.append("file", prevFile as Blob);
                }
                return prevFile;
            })

            mutate.mutate({body: formData});
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
    }, [status, title, license]);

    return (
        !isLoading && !licenseLoading && (
            <Form>
                <FormRow>
                    <Input label="ID" name="ID" value={license.id} disabled />
                    <Input label="Chemin d'accès" name="path" value={license.path} disabled />
                </FormRow>
                <FormRow>
                    <Input label="Titre" error={error.title} name="title" value={license.title} setValue={handleChangeInput} focus required />   
                    <Select 
                        label="Categorie" 
                        name="categoryId" 
                        error={error.categoryId} 
                        groups={categories} 
                        placeholder="Sélectionner une catégorie" 
                        value={license.categoryId} 
                        setValue={handleChangeSelect} 
                        required 
                    />
                </FormRow>
                <FormRow>
                    <Boolean label="Top 100" name="top100" value={license.top100} setValue={() => setLicense({
                        ...license,
                        top100: !license.top100
                    })} required />
                    <Boolean label="Actif" name="isActive" value={license.isActive} setValue={() => setLicense({
                        ...license,
                        isActive: !license.isActive
                    })} required />
                </FormRow>
                <FormRow>
                    <File label="Fichier" name="file" value={file} setValue={handleChangeFile} error={error.file} placeholder={license.picture} required />
                </FormRow>
            </Form>          
        )
    )
}

export default EditLicense;