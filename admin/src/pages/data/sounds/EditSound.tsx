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
import FormRow from "@components/FormRow";
import { useParams } from "react-router-dom";

interface Sound {
    id: number;
    title: string;
    url: string;
    path: string;
    order: number;
    isActive: boolean;
    before: number;
    after: number;
    licenseId: number;
    typeId: number;
}

type ErrorKeys = 'title' | 'url' | 'order' | 'before' | 'after' | 'licenseId' | 'typeId';

interface ErrorState {
  title: string;
  url: string;
  order: string;
  before: string;
  after: string;
  licenseId: string;
  typeId: string;
}

function EditSound(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [sound, setSound] = useState<Sound>({
        id: 0,
        title: "",
        url: "",
        path: "",
        order: 0,
        isActive: true,
        before: 0,
        after: 0,
        licenseId: 0,
        typeId: 0
    });
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<ErrorState>({
        title: "",
        url: "",
        order: "",
        before: "",
        after: "",
        licenseId: "",
        typeId: "",
    });
    const [status, setStatus] = useState("idle");
    const [licenses, setLicenses] = useState<Group[]>([]);
    const [types, setTypes] = useState<Group[]>([]);

    const { data, isLoading } = useFetch({ 
        name: "licences", 
        url: `sounds/add`
    });

    const { data: soundData, isLoading: soundLoading } = useFetch({ 
        name: "sound", 
        url: `sounds/${id}` 
    });

    const mutate = useMutation({
        url: `sounds/${id}`,
        method: "PATCH",
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
            toast.error("Une erreur est survenue lors de la modification du son");
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

        console.log(sound);

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

        if (sound.licenseId === 0) {
            newError.licenseId = "La licence est obligatoire";
        }

        if (sound.typeId === 0) {
            newError.typeId = "Le type est obligatoire";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Modification du son en cours...");

        setSound((prevSound) => {
            mutate.mutate({body: {
                title: prevSound.title,
                url: prevSound.url,
                order: prevSound.order,
                isActive: prevSound.isActive,
                before: prevSound.before,
                after: prevSound.after,
                licenseId: prevSound.licenseId,
                typeId: prevSound.typeId
            }});
            return prevSound;
        })
        
    };

    useEffect(() => {
        if(data && data.success){
            setLicenses(data.licenses);
            setTypes(data.types);
        }
    }, [data]);

    useEffect(() => {
        if(soundData && soundData.success){
            setSound(soundData.sound);
            setTitle(soundData.sound.title);
        }
    }, [soundData]);

    useEffect(() => {
        setCurrentPage({
            title: `Modifier le son : ${title}`,
            Buttons: [
                <Button label="Retour" link={"/data/sounds"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Modifier le son" onClick={handleSubmit} color="success" status={status} icon={<MdEdit />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Modifier
                    </span>
                </Button>
            ]
        });
    }, [status, title, sound]);

    return (
        !isLoading && !soundLoading && (
            <Form>
                <FormRow>
                    <Input label="ID" name="ID" value={sound.id} disabled />
                    <Input label="Chemin d'accès" name="path" value={sound.path} disabled />
                </FormRow>
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
                    <Select
                        label="Licence" 
                        name="licenseId" 
                        error={error.licenseId} 
                        groups={licenses} 
                        placeholder="Sélectionner une licence" 
                        value={sound.licenseId} 
                        setValue={handleChangeSelect} 
                        required 
                        displayGroup
                    />
                    <Select 
                        label="Type" 
                        name="typeId" 
                        error={error.typeId} 
                        groups={types} 
                        placeholder="Sélectionner un type" 
                        value={sound.typeId} 
                        setValue={handleChangeSelect} 
                        required 
                    />
                </FormRow>
            </Form>          
        )
    )
}

export default EditSound;