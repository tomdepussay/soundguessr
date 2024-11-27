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

interface Role {
    id: number;
    name: string;
    description: string;
}

function DetailsRole(){

    const { hasPermission } = useContext(AuthContext);
    const { id } = useParams();
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { setCurrentPage } = useContext(DataContext);
    const [role, setRole] = useState<Role>({
        id: 0,
        name: "",
        description: ""
    });
    const navigate = useNavigate();
    const { data, isLoading } = useFetch({ 
        name: "roles", 
        url: `roles/${id}` 
    });

    const mutation = useMutation({
        url: `roles`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                setTimeout(() => {
                    navigate("/data/roles");
                }, 1000);
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Une erreur s'est produite lors de la suppression du rôle");
            console.error("Erreur lors de la suppression du rôle", error);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: "Détails du rôle",
            Buttons: [
                <Button label="Retour" link={"/data/roles"} color="danger">
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
            setRole(data.role);
        }
    }, [data]);

    return (
        <div className="w-full h-fit">
            {
                hasPermission(["admin.data.roles.edit", "admin.data.roles.delete"]) && (
                    <div className="w-full flex gap-10 ps-5 my-5 items-center justify-start">
                        <Button label="Modifier le rôle" visible={hasPermission("admin.data.roles.edit")} link={`/data/categories/edit/${role.id}`} color='success'>
                            <FaEdit />
                            Modifier
                        </Button>
                        <Button label="Supprimer le rôle" visible={hasPermission("admin.data.roles.edit")} onClick={() => {
                            showAlert(`Voulez-vous vraiment supprimer le rôle "${role.name}" ?`, () => {

                                mutation.mutate({ param: role.id });
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
                        </FormRow>
                        <FormRow>
                            <Input label="Nom" name="name" value={role.name} disabled />
                            <Input label="Description" name="description" value={role.description} disabled />
                        </FormRow>
                    </Form>
                )
            }
            
        </div>
    )
}

export default DetailsRole;