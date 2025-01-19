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

interface Sound {
    title: string;
    url: string;
    order: number;
    isActive: boolean;
    before: number;
    after: number;
    license: Option;
    type: Option;
}

type ErrorKeys = 'title' | 'url' | 'order' | 'before' | 'after' | 'license' | 'type';

interface ErrorState {
  title: string;
  url: string;
  order: string;
  before: string;
  after: string;
  license: string;
  type: string;
}

function AddSound(){

    const { setCurrentPage } = useContext(DataContext);
    const [sound, setSound] = useState<Sound>({
        title: "",
        url: "",
        order: 0,
        isActive: true,
        before: 0,
        after: 0,
        license: { label: "", value: 0 },
        type: { label: "", value: 0 }
    });
    const [error, setError] = useState<ErrorState>({
        title: "",
        url: "",
        order: "",
        before: "",
        after: "",
        license: "",
        type: "",
    });
    const [status, setStatus] = useState("idle");
    const [licenses, setLicenses] = useState<Group[]>([]);
    const [types, setTypes] = useState<Group[]>([]);

    const { data, isLoading } = useFetch({ 
        name: "licences", 
        url: `sounds/add`
    });

    const mutate = useMutation({
        url: "sounds",
        method: "PUT",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/sounds";
                }, 1000);
            } else {
                setStatus("error");
                toast.error(data.message);
            }
        },
        error: (error: string) => {
            toast.error("Une erreur est survenue lors de l'ajout du son");
            console.log(error);
        }
    })

    const handleErrors = (name: string) => {
        setStatus("idle");
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
    
        setSound({
            ...sound,
            [name]: value
        });
    };

    const handleChangeSelect = ({ name, value }: {name: string, value: number}) => {
        handleErrors(name);
    
        setSound({
            ...sound,
            [name]: value
        });
    }

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (sound.title === "") {
            newError.title = "Le titre est obligatoire";
        } else if (sound.title.length > 255) {
            newError.title = "Le titre ne doit pas dépasser 255 caractères";
        }

        if (sound.url === "") {
            newError.url = "L'url est obligatoire";
        }

        if(sound.order <= 0){
            newError.order = "L'ordre est obligatoire";
        }

        if (sound.before < 0) {
            newError.before = "La valeur doit être positive";
        }

        if(sound.after < 0){
            newError.after = "La valeur doit être positive";
        }

        if (sound.license.value === 0) {
            newError.license = "La licence est obligatoire";
        }

        if (sound.type.value === 0) {
            newError.type = "Le type est obligatoire";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Ajout du son en cours...");

        mutate.mutate({ body: {
            title: sound.title,
            url: sound.url,
            order: sound.order,
            isActive: sound.isActive,
            before: sound.before,
            after: sound.after,
            licenseId: sound.license.value,
            typeId: sound.type.value
        } });
        
    };

    useEffect(() => {
        if(data && data.success){
            setLicenses(data.licenses);
            setTypes(data.types);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage({
            title: "Ajouter un son",
            Buttons: [
                <Button label="Retour" link={"/data/sounds"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Ajouter un son" onClick={handleSubmit} color="success" status={status} icon={<MdAdd />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Ajouter
                    </span>
                </Button>
            ]
        });
    }, [status, sound, error]);

    return (
        <Form>
            <FormRow>
                <Input label="Titre" error={error.title} name="title" value={sound.title} setValue={handleChangeInput} focus required />
                <Input label="URL" error={error.url} name="url" value={sound.url} setValue={handleChangeInput} required />
                <Input type="number" error={error.order} label="Ordre" name="order" value={sound.order} setValue={handleChangeInput} required />
            </FormRow>
            <FormRow>
                <Boolean label="Actif" name="isActive" value={sound.isActive} setValue={() => setSound({
                    ...sound,
                    isActive: !sound.isActive
                })} required />
                <Input type="number" label="Rogner au début" error={error.before} name="before" value={sound.before} setValue={handleChangeInput} />
                <Input type="number" label="Rogner à la fin" error={error.after} name="after" value={sound.after} setValue={handleChangeInput} />
            </FormRow>
            <FormRow>
                {
                    !isLoading && (
                        <>
                            <Select
                                label="Licence" 
                                name="license" 
                                error={error.license} 
                                groups={licenses} 
                                placeholder="Sélectionner une licence" 
                                value={sound.license} 
                                setValue={handleChangeSelect} 
                                required 
                            />
                            <Select 
                                label="Type" 
                                name="type" 
                                error={error.type} 
                                groups={types} 
                                placeholder="Sélectionner un type" 
                                value={sound.type} 
                                setValue={handleChangeSelect} 
                                required 
                            />
                        </>
                    )
                }
            </FormRow>
        </Form>
    )
}

export default AddSound;