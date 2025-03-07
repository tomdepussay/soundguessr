import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/services/DataContext";
import Button from "@components/Button";
import Input from "@components/Input";
import Boolean from "@components/Boolean";
import MultiSelect from "@components/MultiSelect";
import File from "@components/File";
import { FaArrowLeft } from "react-icons/fa";
import useFetch from "@services/useFetch";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import useMutation from "@services/useMutation";
import Form from "@components/Form";
import FormRow from "@components/FormRow";
import { useParams } from "react-router-dom";

interface Right {
    id: number;
    name: string;
    code: string;
    roles: Option[];
}

type ErrorKeys = 'name' | 'code';

interface ErrorState {
    name: string;
    code: string;
}

function EditRight(){

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [right, setRight] = useState<Right>({
        id: 0,
        name: "",
        code: "",
        roles: []
    });
    const [roles, setRoles] = useState<Group[]>([]);
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<ErrorState>({
        name: "",
        code: ""
    });
    const [status, setStatus] = useState("idle");

    const { data, isLoading } = useFetch({ 
        name: "rights", 
        url: `rights/${id}`
    });

    const { data: dataRoles, isLoading: isLoadingRoles } = useFetch({
        name: "rightsAdd",
        url: "rights/add"
    });

    const mutate = useMutation({
        url: `rights/${id}`,
        method: "PATCH",
        success: (data: any) => {
            if(data.success){
                setStatus("success");
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = "/data/rights";
                }, 1000);
            } else {
                setStatus("error");
                toast.error(data.message);
            }
        },
        error: (error: string) => {
            toast.error("Une erreur s'est produite lors de la modification du droit");
            console.log(error);
        }
    })


    const handleErrors = (name: string) => {
        if (error[name as ErrorKeys] !== "") {
            setError({
                ...error,
                [name]: ""
            });
          setStatus("idle");
        }
    };

    const handleChangeSelect = ({ name, value }: {name: string, value: number}) => {
        setRight({
            ...right,
            [name]: value
        });
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleErrors(name);
    
        setRight({
            ...right,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setStatus("loading");

        let newError: Partial<ErrorState> = {};

        if (right.name === "") {
            newError.name = "Le nom est obligatoire";
        } else if (right.name.length > 255) {
            newError.name = "Le nom ne doit pas dépasser 255 caractères";
        }

        if (right.code === "") {
            newError.code = "Le code est obligatoire";
        } else if (right.code.length > 255) {
            newError.code = "Le code ne doit pas dépasser 255 caractères";
        }

        if (Object.keys(newError).length > 0) {
            setStatus("error");
            setError({
                ...error,
                ...newError
            });
            return;
        }

        toast.loading("Modification du droit en cours...");

        mutate.mutate({ body: {
            name: right.name,
            code: right.code,
            roles: right.roles.map((role: Option) => role.value)
        } });
    };

    useEffect(() => {
        if(data && dataRoles && dataRoles.success && data.success){
            const roles = data.right.roles.map((role: any) => role.id);
            const rolesList: Option[] = [];
            roles.forEach((role: number) => {
                dataRoles.roles.forEach((group: Group) => {
                    const option = group.options.find((option: Option) => option.value === role);
                    if(option){
                        rolesList.push(option);
                    }
                })     
            })

            setRight({
                ...data.right,
                roles: rolesList
            })

            setName(data.right.name);
        }
    }, [data]);

    useEffect(() => {
        if(dataRoles && dataRoles.success){
            setRoles(dataRoles.roles);
        }
    })

    useEffect(() => {
        setCurrentPage({
            title: `Modifier le droit : ${name}`,
            Buttons: [
                <Button label="Retour" link={"/data/rights"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Modifier le droit" onClick={handleSubmit} color="success" status={status} icon={<MdEdit />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Modifier
                    </span>
                </Button>
            ]
        });
    }, [status, name, right]);

    return (
        !isLoading && !isLoadingRoles && right && (
            <Form>
                <FormRow>
                    <Input label="ID" name="ID" value={right.id} disabled />
                </FormRow>
                <FormRow>
                    <Input label="Nom" error={error.name} name="name" value={right.name} setValue={handleChangeInput} focus required />  
                    <Input label="Code" error={error.code} name="code" value={right.code} setValue={handleChangeInput} required />
                    <MultiSelect 
                        label="Rôle(s)"
                        placeholder="Sélectionner un ou plusieurs rôles"
                        name="roles"
                        value={right.roles}
                        setValue={handleChangeSelect}
                        groups={roles}
                    />
                </FormRow>
            </Form>          
        )
    )
}

export default EditRight;