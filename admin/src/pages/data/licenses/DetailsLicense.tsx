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

interface License {
    id: number;
    title: string;
    path: string;
    image: string;
    top100: number;
    isActive: boolean;
    categoryId: number;
    category: string;
}

function DetailsLicense(){

    const { id } = useParams();
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { setCurrentPage } = useContext(DataContext);
    const [license, setLicense] = useState<License>({
        id: 0,
        title: "",
        path: "",
        image: "",
        top100: 0,
        isActive: false,
        categoryId: 0,
        category: ""
    });
    const navigate = useNavigate();
    const { data, isLoading } = useFetch({ 
        name: "license", 
        url: `licenses/${id}` 
    });

    const mutation = useMutation({
        url: `licenses`,
        method: "DELETE",
        success: () => {
            toast.success("Licence supprimée avec succès !");
            hideAlert();
            setTimeout(() => {
                navigate("/data/licenses");
            }, 1000);
        },
        error: (error: any) => {
            toast.error("Erreur lors de la suppression de la licence");
            console.error("Erreur lors de la suppression de la licence", error);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: "Détails de la licence",
            Buttons: [
                <Button link={"/data/licenses"} color="danger">
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
            setLicense(data.license);
        }
    }, [data]);

    return (
        <div className="w-full h-fit">
            <div className="w-full flex gap-2 my-5 items-center justify-evenly">
                <Button link={`/data/sounds/edit/${license.id}`} color='success'>
                    <FaEdit />
                    Modifier
                </Button>
                <Button onClick={() => {
                    showAlert(`Voulez-vous vraiment supprimer la licence "${license.title}" ?`, () => {
                        
                        mutation.mutate({ param: license.id });
                    });
                }} color='danger'>
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
                        <Input label="Titre" name="title" value={license.title} disabled />
                        <Input label="Chemin d'accès" name="path" value={license.path} disabled />
                        <Input label="Top 100" name="top100" value={license.top100} disabled />
                        <Boolean label="Actif" name="isActive" value={license.isActive} disabled />
                        <Select label="Categorie" name="category" groups={[
                            {
                                label: "1",
                                options: [
                                    { label: license.category, value: license.categoryId }
                                ]
                            }
                        ]} value={license.categoryId} disabled />

                        <img src={license.image} alt="Image de la licence" />
                    </div>
                )
            }
            
        </div>
    )
}

export default DetailsLicense;