import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import { FaArrowLeft } from "react-icons/fa";
import useFetch from "@services/useFetch";
import { MdAdd } from "react-icons/md";

interface Sound {
    title: string;
    url: string;
    order: number;
    isActive: boolean;
    before: number;
    after: number;
    licenseId: number;
    typeId: number;
}

interface Group {
    label: string;
    options: Option[];
}

interface Option {
    label: string;
    value: string | number;
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

function addSound(){

    const { setCurrentPage } = useContext(DataContext);
    const [sound, setSound] = useState({
        title: "",
        url: "",
        order: 0,
        isActive: true,
        before: 0,
        after: 0,
        licenseId: 0,
        typeId: 0
    });
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
    const [file, setFile] = useState<File | null>(null);
    const [licenses, setLicenses] = useState<Group[]>([]);
    const [types, setTypes] = useState<Group[]>([]);

    const { data, isLoading } = useFetch({ name: "licences", 
        url: `sounds/add`
    });

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        if (error[name as ErrorKeys] !== "") {
            setError({
                ...error,
                [name]: ""
            });
          setStatus("idle");
        }
    
        setSound({
            ...sound,
            [name]: value
        });
    };

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

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        // Proceed with form submission logic here
    }

    useEffect(() => {
        console.log(error);
    }, [error]);

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
                <Button link={"/data/sounds"} color="danger">
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
    }, [status]);

    return (
        <div className="w-full h-fit grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <Input label="Titre" error={error.title} name="title" value={sound.title} setValue={handleChangeInput} required />
            <Input label="URL" error={error.url} name="url" value={sound.url} setValue={handleChangeInput} required />
            <Input type="number" error={error.order} label="Ordre" name="order" value={sound.order} setValue={handleChangeInput} required />
            <Boolean label="Actif" name="isActive" value={sound.isActive} setValue={() => setSound({
                ...sound,
                isActive: !sound.isActive
            })} required />
            <Input label="Rogner au début" error={error.before} name="before" value={sound.before} setValue={handleChangeInput} />
            <Input label="Rogner à la fin" error={error.after} name="after" value={sound.after} setValue={handleChangeInput} />
            {
                !isLoading && (
                    <>
                        <Select label="Licence" name="licence" error={error.licenseId} groups={licenses} placeholder="Sélectionner une licence" value={sound.licenseId} setValue={(value) => setSound({
                            ...sound,
                            licenseId: parseInt(value)
                        })} required displayGroup/>
                        <Select label="Type" name="type" error={error.typeId} groups={types} placeholder="Sélectionner un type" value={sound.typeId} setValue={
                            (value) => setSound({
                                ...sound,
                                typeId: parseInt(value)
                            })
                        } required />
                    </>
                )
            }
            
            
        </div>
    )
}

export default addSound;