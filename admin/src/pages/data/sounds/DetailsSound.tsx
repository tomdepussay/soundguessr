import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import useFetch from "@services/useFetch";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import { FaArrowLeft } from "react-icons/fa";

interface Sound {
    id: number;
    title: string;
    url: string;
    path: string;
    audio: string;
    order: number;
    isActive: boolean;
    before: number;
    after: number;
    licenseId: number;
    license: string;
    typeId: number;
    type: string;
}

function DetailsSound(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [sound, setSound] = useState<Sound>({
        id: 0,
        title: "",
        url: "",
        path: "",
        audio: "",
        order: 0,
        isActive: false,
        before: 0,
        after: 0,
        licenseId: 0,
        license: "",
        typeId: 0,
        type: ""
    });
    const { data, isLoading } = useFetch({ name: "sound", 
        url: `sounds/${id}` 
    });

    useEffect(() => {
        setCurrentPage({
            title: "Détails du son",
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

    useEffect(() => {
        if(data){
            setSound(data.sound);
        }
    }, [data]);

    return (
        <div className="w-full h-fit grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <Input label="ID" name="ID" value={id} disabled />
            <Input label="Titre" name="title" value={sound.title} disabled />
            <Input label="URL" name="url" value={sound.url} disabled />
            <Input label="Chemin d'accès" name="path" value={sound.path} disabled />
            <Input label="Ordre" name="order" value={sound.order} disabled />
            <Boolean label="Actif" name="isActive" value={sound.isActive} disabled />
            <Input label="Rogner au début" name="before" value={sound.before} disabled />
            <Input label="Rogner à la fin" name="after" value={sound.after} disabled />
            <Select label="Licence" name="licence" options={[{ value: sound.licenseId, label: sound.license }]} value={sound.licenseId} disabled />
            <Select label="Type" name="type" options={[{ value: sound.typeId, label: sound.type }]} value={sound.typeId} disabled />
        </div>
    )
}

export default DetailsSound;