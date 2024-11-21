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

interface Profile {
    id: number;
    name: string;
    description: string;
}

function DetailsProfile(){

    const { hasPermission } = useContext(AuthContext);
    const { id } = useParams();
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { setCurrentPage } = useContext(DataContext);
    const [profile, setProfile] = useState<Profile>({
        id: 0,
        name: "",
        description: ""
    });
    const navigate = useNavigate();
    const { data, isLoading } = useFetch({ 
        name: "profiles", 
        url: `profiles/${id}` 
    });

    const mutation = useMutation({
        url: `profiles`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                setTimeout(() => {
                    navigate("/data/profiles");
                }, 1000);
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Une erreur s'est produite lors de la suppression du profil");
            console.error("Erreur lors de la suppression du profil", error);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: "Détails du profil",
            Buttons: [
                <Button link={"/data/profiles"} color="danger">
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
            setProfile(data.profile);
        }
    }, [data]);

    return (
        <div className="w-full h-fit">
            {
                hasPermission(["admin.data.profiles.edit", "admin.data.profiles.delete"]) && (
                    <div className="w-full flex gap-10 ps-5 my-5 items-center justify-start">
                        <Button visible={hasPermission("admin.data.profiles.edit")} link={`/data/categories/edit/${profile.id}`} color='success'>
                            <FaEdit />
                            Modifier
                        </Button>
                        <Button visible={hasPermission("admin.data.profiles.edit")} onClick={() => {
                            showAlert(`Voulez-vous vraiment supprimer le profil "${profile.name}" ?`, () => {

                                mutation.mutate({ param: profile.id });
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
                            <Input label="Nom" name="name" value={profile.name} disabled />
                            <Input label="Description" name="description" value={profile.description} disabled />
                        </FormRow>
                    </Form>
                )
            }
            
        </div>
    )
}

export default DetailsProfile;