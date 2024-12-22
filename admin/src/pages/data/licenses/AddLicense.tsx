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

interface License {
    title: string;
    top100: boolean;
    isActive: boolean;
    categoryId: Option;
}

type ErrorKeys = 'title' | 'categoryId' | 'file';

interface ErrorState {
    title: string;
    categoryId: string;
    file: string;
}

function AddLicense(){

    const { setCurrentPage } = useContext(DataContext);
    const [license, setLicense] = useState<License>({
        title: "",
        top100: true,
        isActive: true,
        categoryId: { label: "", value: 0 }
    });
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<ErrorState>({
        title: "",
        categoryId: "",
        file: ""
    });
    const [status, setStatus] = useState("idle");
    const [categories, setCategories] = useState<Group[]>([]);

    const { data, isLoading } = useFetch({ 
        name: "licenseAdd", 
        url: `licenses/add`
    });

    const mutate = useMutation({
        url: "licenses",
        method: "PUT",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/licenses";
                }, 1000);
            } else {
                toast.error(data.message);
                setStatus("error");
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de l'ajout de la licence");
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

    const handleChangeSelect = ({ name, value }: {name: string, value: number}) => {
        handleErrors(name);
    
        setLicense({
            ...license,
            [name]: value
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

        if (license.categoryId.value === 0) {
            newError.categoryId = "La catégorie est obligatoire";
        }

        if(!file){
            newError.file = "Le fichier est obligatoire";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Ajout de la licence en cours...");

        const formData = new FormData();
        formData.append("title", license.title);
        formData.append("top100", license.top100.toString());
        formData.append("isActive", license.isActive.toString());
        formData.append("categoryId", license.categoryId.value);
        formData.append("file", file as Blob);

        mutate.mutate({ body: formData });
        
    };

    useEffect(() => {
        if(data && data.success){
            setCategories(data.categories);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage({
            title: "Ajouter une licence",
            Buttons: [
                <Button label="Retour" link={"/data/licenses"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Ajouter une licence" onClick={handleSubmit} color="success" status={status} icon={<MdAdd />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Ajouter
                    </span>
                </Button>
            ]
        });
    }, [status, license, error]);

    return (
        <Form>
            <FormRow>
                <Input label="Titre" error={error.title} name="title" value={license.title} setValue={handleChangeInput} focus required />
                {
                    !isLoading && (
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
                    )
                }
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
                <File label="Fichier" name="file" value={file} setValue={handleChangeFile} error={error.file} required />
            </FormRow>
        </Form>
    )
}

export default AddLicense;