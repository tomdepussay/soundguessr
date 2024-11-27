import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { DataContext } from "@/services/DataContext";
import useFetch from "@/services/useFetch";
import useMutation from "@/services/useMutation";
import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowsAltH } from "react-icons/fa";
import { useParams } from "react-router-dom";

interface Profile {
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
    affected: boolean;
    before: number[];
}

function RightsProfile() {

    const { id } = useParams();
    const { setCurrentPage } = useContext(DataContext);
    const [profile, setProfile] = useState<Profile>({
        id: 0,
        name: "",
        description: null
    });
    const [status, setStatus] = useState("idle");
    const [maxColumn, setMaxColumn] = useState<number>(0);
    const [selected, setSelected] = useState<{
        level: number,
        codes: number[]
    }>({
        level: -1,
        codes: []
    });
    const [cols, setCols] = useState<Column[]>([{
        level: 0,
        value: null
    }]);
    const [rights, setRights] = useState<number[]>([]);

    const { data, isLoading } = useFetch({ 
        name: "profile", 
        url: `profiles/${id}`
    });

    const { data: dataMaxColumn, isLoading: isLoadingMaxColumn } = useFetch({
        name: "maxColumn",
        url: "profiles/add"
    });

    const { data: dataRightsProfile, isLoading: isLoadingRightsProfile } = useFetch({
        name: "RightsProfile",
        url: `profiles/rights/${id}`
    });

    const mutate = useMutation({
        url: `rights/level`,
        method: "POST",
        success: (data) => {
            let rights = [];
            let before = [];
            for(let code of selected.codes){
                before.push(code);
            }

            for(let right of data.rights){
                right.before = before;
                rights.push(right);
            }

            setCols((prevCol: any) => 
                prevCol.map((item: Column) => 
                    item.level === selected.level + 1 ? {...item, value: rights} : item
                )
            )
        },
        error: (err) => {
            console.log(err);
        }
    })

    const mutateSubmit = useMutation({
        url: `profiles/rights/${id}`,
        method: "POST",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                setStatus("success");
                setTimeout(() => {
                    window.location.href = "/data/profiles";
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

    const handleSubmmit = () => {
        setStatus("loading");

        setRights((prevRights) => {
            mutateSubmit.mutate({ body: {
                rights: prevRights
            } })
            
            return prevRights;
        })
    }

    useEffect(() => {
        if(data && data.success){
            setProfile(data.profile);
        }
    }, [data]);

    useEffect(() => {
        if(dataMaxColumn && dataMaxColumn.success){
            setMaxColumn(dataMaxColumn.maxColumn)
            const newCols = Array.from({ length: dataMaxColumn.maxColumn - 1 }, (_, i) => ({
                level: cols.length + i,
                value: null,
            }));

            setCols((prevCols) => [...prevCols, ...newCols]);
        }
    }, [dataMaxColumn])
    
    useEffect(() => {
        if(dataRightsProfile && dataRightsProfile.success){
            setRights(dataRightsProfile.rights);
        }    
    }, [dataRightsProfile])

    useEffect(() => {
        mutate.mutate({
            body: {
                rightId: selected.codes.length > 0 ? selected.codes[selected.codes.length - 1] : undefined
            }
        })
    }, [selected])


    useEffect(() => {
        setCurrentPage({
            title: `Affecter les droits au profil : ${profile.name}`,
            Buttons: [
                <Button label="Retour" link={"/data/profiles"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button label="Affecter les droits" onClick={handleSubmmit} color="success" status={status} icon={<FaArrowsAltH />}>
                    <span className="text-xl flex justify-center items-center gap-2">
                        Affecter
                    </span>
                </Button>
            ]
        });
    }, [status, profile]);

    return (
        <div className="flex-1 h-full">
            {
                (isLoading && isLoadingMaxColumn) ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3 h-full">
                        {
                            Array.from({ length: maxColumn }).map((_, index) => (
                                <div key={index} className="bg-slate-900/40 rounded-2xl shadow-lg p-2">
                                    <ul>
                                        {
                                            cols[index] && cols[index].value && cols[index].value.map((right: Right) => (
                                                <li 
                                                    key={right.id}
                                                    className={`text-white select-none p-2 text-lg mb-2 rounded-xl cursor-pointer 
                                                        ${selected.codes.includes(right.id) ? 
                                                        (
                                                            rights.includes(right.id) ?
                                                            "bg-green-600/60 hover:bg-green-500/60" :
                                                            "bg-slate-900/70"
                                                        ) : 
                                                        (
                                                            rights.includes(right.id) ? 
                                                            "bg-green-500/60 hover:bg-green-600/60" :
                                                            "hover:bg-slate-900/70"
                                                        )}`} 
                                                    onClick={() => {
                                                        if(!selected.codes.includes(right.id)){
                                                            setSelected({
                                                                level: index,
                                                                codes : right.before.length > 0 ? [...right.before, right.id] : [right.id]
                                                            })

                                                            setCols((prevCol: any) => 
                                                                prevCol.map((item: Column) => 
                                                                    item.level > index + 1 ? {...item, value: data.rights} :  item
                                                                )
                                                            )
                                                        }
                                                    }}
                                                    onDoubleClick={() => {
                                                        setRights((prevRights) => {
                                                            if (prevRights.includes(right.id)) {
                                                                return prevRights.filter(id => id !== right.id);
                                                            } else {
                                                                let rightsId = [];

                                                                for(let right of selected.codes){
                                                                    if(!prevRights.includes(right)){
                                                                        rightsId.push(right);
                                                                    }
                                                                }

                                                                return [...prevRights, ...rightsId];
                                                            }
                                                        })
                                                    }}
                                                >
                                                    {right.name}
                                                </li>
                                            ))
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

export default RightsProfile;