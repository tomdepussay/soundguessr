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

interface Type {
    id: number;
    name: string;
    isActive: boolean;
}

function DetailsType(){

    const { id } = useParams();
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { setCurrentPage } = useContext(DataContext);
    const [type, setType] = useState<Type>({
        id: 0,
        name: "",
        isActive: false
    });
    const navigate = useNavigate();
    const { data, isLoading } = useFetch({ 
        name: "types", 
        url: `types/${id}` 
    });

    const mutation = useMutation({
        url: `categories`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                setTimeout(() => {
                    navigate("/data/types");
                }, 1000);
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Une erreur s'est produite lors de la suppression du type");
            console.error("Erreur lors de la suppression du type", error);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: "Détails du type",
            Buttons: [
                <Button link={"/data/types"} color="danger">
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
            setType(data.type);
        }
    }, [data]);

    return (
        <div className="w-full h-fit">
            <div className="w-full flex gap-10 ps-5 my-5 items-center justify-start">
                <Button link={`/data/types/edit/${type.id}`} color='success'>
                    <FaEdit />
                    Modifier
                </Button>
                <Button onClick={() => {
                    showAlert(`Voulez-vous vraiment supprimer le type "${type.name}" et ses sons ?`, () => {
                        
                        mutation.mutate({ param: type.id });
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
                    <Form>
                        <FormRow>
                            <Input label="ID" name="ID" value={id} disabled />
                        </FormRow>
                        <FormRow>
                            <Input label="Nom" name="name" value={type.name} disabled />
                        </FormRow>
                    </Form>
                )
            }
            
        </div>
    )
}

export default DetailsType;