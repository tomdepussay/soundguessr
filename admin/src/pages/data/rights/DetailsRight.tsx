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
import MultiSelect from "@/components/MultiSelect";

interface Right {
    id: number;
    name: string;
    code: string;
}

function DetailsRight(){

    const { hasPermission } = useContext(AuthContext);
    const { id } = useParams();
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { setCurrentPage } = useContext(DataContext);
    const [right, setRight] = useState<Right>({
        id: 0,
        name: "",
        code: ""
    });
    const navigate = useNavigate();
    const { data, isLoading } = useFetch({ 
        name: "rights", 
        url: `rights/${id}` 
    });

    const mutation = useMutation({
        url: `rights`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                setTimeout(() => {
                    navigate("/data/rights");
                }, 1000);
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Une erreur s'est produite lors de la suppression du droit");
            console.error("Erreur lors de la suppression du droit", error);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: "Détails du droit",
            Buttons: [
                <Button label="Retour" link={"/data/rights"} color="danger">
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
            setRight(data.right);
        }
    }, [data]);

    return (
        <div className="w-full h-fit">
            {
                hasPermission(["admin.data.rights.edit", "admin.data.rights.delete"]) && (
                    <div className="w-full flex gap-10 ps-5 my-5 items-center justify-start">
                        <Button label="Modifier le droit" visible={hasPermission("admin.data.rights.edit")} link={`/data/categories/edit/${right.id}`} color='success'>
                            <FaEdit />
                            Modifier
                        </Button>
                        <Button label="Supprimer le droit" visible={hasPermission("admin.data.rights.delete")} onClick={() => {
                            showAlert(`Voulez-vous vraiment supprimer le droit "${right.name}" ?`, () => {

                                mutation.mutate({ param: right.id });
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
                            <Input label="Nom" name="name" value={right.name} disabled />
                            <Input label="Code" name="code" value={right.code} disabled />
                            <MultiSelect 
                                disabled
                                label="Rôle(s)"
                                placeholder="Sélectionner un ou plusieurs rôles"
                                name="roles"
                                value={right.roles}
                                groups={roles}
                            />
                        </FormRow>
                    </Form>
                )
            }
            
        </div>
    )
}

export default DetailsRight;