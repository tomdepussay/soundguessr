import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import { FaArrowLeft } from "react-icons/fa";
import useFetch from "@services/useFetch";

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
    const [file, setFile] = useState<File | null>(null);
    const [licenses, setLicenses] = useState<Group[]>([]);
    const [types, setTypes] = useState<Group[]>([]);

    const { data, isLoading } = useFetch({ name: "licences", 
        url: `sounds/add`
    });

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSound({
            ...sound,
            [e.target.name]: e.target.value
        });
    }

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
                </Button>
            ]
        });
    }, []);

    return (
        <div className="w-full h-fit grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <Input label="Titre" name="title" value={sound.title} setValue={handleChangeInput} required />
            <Input label="URL" name="url" value={sound.url} setValue={handleChangeInput} required />
            <Input type="number" label="Ordre" name="order" value={sound.order} setValue={handleChangeInput} required />
            <Boolean label="Actif" name="isActive" value={sound.isActive} setValue={() => setSound({
                ...sound,
                isActive: !sound.isActive
            })} required />
            <Input label="Rogner au début" name="before" value={sound.before} setValue={handleChangeInput} />
            <Input label="Rogner à la fin" name="after" value={sound.after} setValue={handleChangeInput} />
            {
                !isLoading && (
                    <>
                        <Select label="Licence" name="licence" groups={licenses}  value={sound.licenseId} setValue={(value) => setSound({
                            ...sound,
                            licenseId: parseInt(value)
                        })} required displayGroup/>
                        <Select label="Type" name="type" groups={types} setValue={
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