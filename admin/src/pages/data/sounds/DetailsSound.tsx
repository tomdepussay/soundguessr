import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import useFetch from "@services/useFetch";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import { FaArrowLeft, FaEdit, FaRegTrashAlt } from "react-icons/fa";
import Loader from "@/components/Loader";

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
        <div className="w-full h-fit">
            <div className="w-full flex gap-2 my-5 items-center justify-evenly">
                <Button link={`${location.pathname}/edit/${sound.id}`} color='success'>
                    <FaEdit />
                    Modifier
                </Button>
                <Button link={`${location.pathname}/delete`} color='danger'>
                    <FaRegTrashAlt />
                    Supprimer
                </Button>
            </div>
            {
                isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <div className="w-full h-fit grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        <Input label="ID" name="ID" value={id} disabled />
                        <Input label="Titre" name="title" value={sound.title} disabled />
                        <Input label="URL" name="url" value={sound.url} disabled />
                        <Input label="Chemin d'accès" name="path" value={sound.path} disabled />
                        <Input label="Ordre" name="order" value={sound.order} disabled />
                        <Boolean label="Actif" name="isActive" value={sound.isActive} disabled />
                        <Input label="Rogner au début" name="before" value={sound.before} disabled />
                        <Input label="Rogner à la fin" name="after" value={sound.after} disabled />
                        <Select label="Licence" name="licence" groups={[
                            {
                                label: "1",
                                options: [
                                    { label: sound.license, value: sound.licenseId }
                                ]
                            }
                        ]} value={sound.licenseId} disabled />
                        <Select label="Type" name="type" groups={[
                            {
                                label: "1",
                                options: [
                                    { label: sound.license, value: sound.licenseId }
                                ]
                            }
                        ]} value={sound.typeId} disabled />

                        <audio src=""></audio>
                    </div>
                )
            }
            
        </div>
    )
}

export default DetailsSound;