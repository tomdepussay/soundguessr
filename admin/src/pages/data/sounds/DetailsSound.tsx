import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import Select from "@components/Select";
import useFetch from "@services/useFetch";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import { FaArrowLeft, FaEdit, FaRegTrashAlt } from "react-icons/fa";
import Loader from "@/components/Loader";
import useMutation from "@/services/useMutation";
import toast from "react-hot-toast";
import { AlertContext } from "@/services/AlertContext";
import Form from "@components/Form";
import FormRow from "@components/FormRow";
import { AuthContext } from "@/services/AuthContext";

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

    const { hasPermission } = useContext(AuthContext);
    const { id } = useParams();
    const { showAlert, hideAlert } = useContext(AlertContext);
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
    const navigate = useNavigate();
    const { data, isLoading } = useFetch({ 
        name: "sound", 
        url: `sounds/${id}` 
    });

    const mutation = useMutation({
        url: `sounds`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                setTimeout(() => {
                    navigate("/data/sounds");
                }, 1000);
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Erreur lors de la suppression du son");
            console.error("Erreur lors de la suppression du son", error);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: "Détails du son",
            Buttons: [
                <Button label="Retour" link={"/data/sounds"} color="danger">
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
            {
                hasPermission(["admin.data.sounds.edit", "admin.data.sounds.delete"]) && (
                    <div className="w-full flex gap-10 ps-5 my-5 items-center justify-start">
                        <Button label="Modifier le son" visible={hasPermission("admin.data.sounds.edit")} link={`/data/sounds/edit/${sound.id}`} color='success'>
                            <FaEdit />
                            Modifier
                        </Button>
                        <Button label="Supprimer le son" visible={hasPermission("admin.data.sounds.delete")} onClick={() => {
                            showAlert(`Voulez-vous vraiment supprimer le son "${sound.title}" ?`, () => {

                                mutation.mutate({ param: sound.id });
                            });
                        }} color='danger'>
                            <FaRegTrashAlt />
                            Supprimer
                        </Button>
                    </div>
                )
            }
            {
                isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Form>
                        <FormRow>
                            <Input label="ID" name="ID" value={id} disabled />
                            <Input label="Chemin d'accès" name="path" value={sound.path} disabled />
                        </FormRow>
                        <FormRow separation>
                            <Input label="Titre" name="title" value={sound.title} disabled />
                            <Input label="URL" name="url" value={sound.url} disabled />
                            <Input label="Ordre" name="order" value={sound.order} disabled />
                        </FormRow>
                        <FormRow>
                            <Boolean label="Actif" name="isActive" value={sound.isActive} disabled />
                            <Input label="Rogner au début" name="before" value={sound.before} disabled />
                            <Input label="Rogner à la fin" name="after" value={sound.after} disabled />
                        </FormRow>
                        <FormRow>
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
                        </FormRow>
                        <FormRow>
                            <audio controls src={sound.audio}>
                                Your browser does not support the
                                <code>audio</code> element.
                            </audio>
                        </FormRow>
                    </Form>
                )
            }
            
        </div>
    )
}

export default DetailsSound;