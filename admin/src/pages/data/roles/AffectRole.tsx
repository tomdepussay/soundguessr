import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { DataContext } from "@/services/DataContext";
import useFetch from "@/services/useFetch";
import useMutation from "@/services/useMutation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowsAltH } from "react-icons/fa";
import { useParams } from "react-router-dom";

interface Role {
    id: number;
    name: string;
    description: string | null;
}

interface Column {
    level: number;
    value: Right[] | null
}

interface Right {
    id: number;
    code: string;
    name: string;
    affected?: boolean;
    parentId: number;
    level: number;
}

function Affect() {

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [role, setRole] = useState<Role>({
        id: 0,
        name: '',
        description: ''
    });
    const [status, setStatus] = useState("idle");
    const [maxColumn, setMaxColumn] = useState<number>(0);
    const [rights, setRights] = useState<Right[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [currentSelected, setCurrentSelected] = useState<number[]>([]);

    const desaffectedChilds = (right: Right): void => {
        right.affected = false; // Désactiver le droit actuel
        const children: Right[] = rights.filter((r: Right) => r.parentId === right.id);
    
        children.forEach((child) => {
            child.affected = false; // Désactiver le droit actuel
            desaffectedChilds(child); // Appeler récursivement pour désactiver ses enfants
        });
    };
    

    const { data, isLoading } = useFetch({ 
        name: "role", 
        url: `roles/${id}`
    });

    const { data: dataAdd, isLoading: isLoadingAdd } = useFetch({
        name: "add",
        url: `roles/add?id=${id}`
    });

    const mutate = useMutation({
        url: `roles/affect/${id}`,
        method: "POST",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                setStatus("success");
                setTimeout(() => {
                    window.location.href = "/data/roles";
                }, 1000)
            } else {
                toast.error(data.message);
                setStatus("error");
            }
        },
        error: (err) => {
            console.log("Erreur lors de l'affectation des droits ", err);
            toast.error("Erreur lors de l'affectation des droits");
        }
    })

    const handleSubmit = () => {
        setStatus("loading");

        const rightsToAffect = rights.filter((right: Right) => right.affected).map((right: Right) => right.id);

        mutate.mutate({
            body: {
                rights: rightsToAffect
            }
        });
    }

    useEffect(() => {
        if(data && data.success){
            setRole(data.role);
        }
    }, [data]);

    useEffect(() => {
        if(dataAdd && dataAdd.success){
            setMaxColumn(dataAdd.maxColumn);

            let rightsMap = dataAdd.rights;

            rightsMap.forEach((right: Right) => {
                right.level = right.code.split(".").length - 1;
                right.affected = dataAdd.rightsAffected.includes(right.id);
            });

            setRights(rightsMap);
        }
    }, [dataAdd]);

    useEffect(() => {
        setCurrentPage({
            title: `Affecter les droits au rôle : ${role.name}`,
            Buttons: [
                <Button label="Retour" link={"/data/roles"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Affecter les droits" onClick={handleSubmit} color="success" status={status} icon={<FaArrowsAltH />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Affecter
                    </span>
                </Button>
            ]
        });
    }, [status, role, rights]);

    return (
        <div className="flex-1 h-full">
            {
                (isLoading && isLoadingAdd) ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <div className={`grid ${"grid-cols-" + maxColumn} gap-3 h-full`}>
                        {
                            Array.from({ length: maxColumn }).map((_, index) => (
                                <div key={index} className="bg-slate-900/40 rounded-2xl shadow-lg p-2">
                                    <ul>
                                        {
                                            currentLevel >= index && rights.filter((right: Right) => right.level === index && (index === 0 || currentSelected.includes(right.parentId))).map((right: Right) => {
                                                return (
                                                    <li
                                                        key={right.id}
                                                        id={right.id.toString()}
                                                        className={`text-white select-none p-2 text-lg mb-2 rounded-xl cursor-pointer ${
                                                            currentSelected.includes(right.id) ? 
                                                            (
                                                                right.affected ?
                                                                "bg-green-600/60 hover:bg-green-500/60" :
                                                                "bg-slate-900/90 shadow shadow-slate-700 hover:bg-slate-900/70"
                                                            ) : 
                                                            (
                                                                right.affected ? 
                                                                "bg-green-500/60 hover:bg-green-600/60" :
                                                                "bg-slate-900/70 hover:bg-slate-900/90"
                                                            )}`}
                                                        onClick={() => {
                                                            let newSelected: number[] = [];
                                                            let currentRight: Right | undefined = right;
                                                            let firstElement = false;

                                                            while(!firstElement && currentRight){
                                                                if(currentRight?.parentId !== null){
                                                                    newSelected.push(currentRight?.id);
                                                                    currentRight = rights.find((r: Right) => r.id === currentRight?.parentId);
                                                                } else {
                                                                    newSelected.push(currentRight?.id);
                                                                    firstElement = true;
                                                                }
                                                            }
                                                            
                                                            setCurrentSelected(newSelected);
                                                            setCurrentLevel(right.level + 1);
                                                            
                                                        }}
                                                        onDoubleClick={() => {
                                                            if(right.affected){
                                                                desaffectedChilds(right); // Désactiver tous les enfants
                                                                setRights([...rights]); 

                                                            } else {
                                                                let rightAffected: number[] = [];
                                                                let currentRight: Right | undefined = right;
                                                                let firstElement = false;

                                                                while(!firstElement && currentRight){
                                                                    if(currentRight?.parentId !== null){
                                                                        rightAffected.push(currentRight?.id);
                                                                        currentRight = rights.find((r: Right) => r.id === currentRight?.parentId);
                                                                    } else {
                                                                        rightAffected.push(currentRight?.id);
                                                                        firstElement = true;
                                                                    }
                                                                }

                                                                setRights(rights.map((r: Right) => {
                                                                    if(rightAffected.includes(r.id)){
                                                                        r.affected = true;
                                                                    }
                                                                    return r;
                                                                }));
                                                            }
                                                            
                                                        }}
                                                    >
                                                        {right.name}
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Affect;