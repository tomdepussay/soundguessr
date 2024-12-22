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

interface License {
    id: number;
    title: string;
    path: string;
    picture: string;
    top100: boolean;
    isActive: boolean;
    category: Option;
}

function DetailsLicense(){

    const { hasPermission } = useContext(AuthContext);
    const { id } = useParams();
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { setCurrentPage } = useContext(DataContext);
    const [license, setLicense] = useState<License>({
        id: 0,
        title: "",
        path: "",
        picture: "",
        top100: false,
        isActive: false,
        category: { label: "", value: 0 }
    });
    const navigate = useNavigate();
    const { data, isLoading } = useFetch({ 
        name: "license", 
        url: `licenses/${id}` 
    });

    const mutation = useMutation({
        url: `licenses`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                setTimeout(() => {
                    navigate("/data/licenses");
                }, 1000);
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Une erreur s'est produite lors de la suppression de la licence");
            console.error("Erreur lors de la suppression de la licence", error);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: "Détails de la licence",
            Buttons: [
                <Button label="Retour" link={"/data/licenses"} color="danger">
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
            setLicense({
                ...data.license,
                category: { label: data.license.category, value: data.license.categoryId }
            });
        }
    }, [data]);

    return (
        <div className="w-full h-fit">
            {
                hasPermission(["admin.data.licenses.edit", "admin.data.licenses.delete"]) && (
                    <div className="w-full flex gap-10 ps-5 my-5 items-center justify-start">
                        <Button label="Modifier la licence" visible={hasPermission("admin.data.licenses.edit")} link={`/data/licenses/edit/${license.id}`} color='success'>
                            <FaEdit />
                            Modifier
                        </Button>
                        <Button label="Supprimer la licence" visible={hasPermission("admin.data.licenses.delete")} onClick={() => {
                            showAlert(`Voulez-vous vraiment supprimer la licence "${license.title}" et ses sons ?`, () => {

                                mutation.mutate({ param: license.id });
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
                            <Input label="Chemin d'accès" name="path" value={license.path} disabled />
                        </FormRow>
                        <FormRow>
                            <Input label="Titre" name="title" value={license.title} disabled />
                            <Select label="Categorie" name="category" groups={[
                                {
                                    label: "1",
                                    options: [
                                        { label: license.category, value: license.categoryId }
                                    ]
                                }
                            ]} value={license.categoryId} disabled />
                        </FormRow>
                        <FormRow>
                            <Boolean label="Top 100" name="top100" value={license.top100} disabled />
                            <Boolean label="Actif" name="isActive" value={license.isActive} disabled />
                        </FormRow>
                        <FormRow>
                            <img src={license.picture} className="w-52" alt={`Image de la licence : ${license.title}`} />
                        </FormRow>
                    </Form>
                )
            }
            
        </div>
    )
}

export default DetailsLicense;