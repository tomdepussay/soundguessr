import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { DataContext } from "@/services/DataContext";
import useFetch from "@/services/useFetch";
import useMutation from "@/services/useMutation";
import React, { useState, useEffect, useContext } from "react";
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
    before: string[];
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
        codes: string[]
    }>({
        level: -1,
        codes: []
    });
    const [cols, setCols] = useState<Column[]>([{
        level: 0,
        value: null
    }]);

    const { data, isLoading } = useFetch({ 
        name: "profile", 
        url: `profiles/${id}`
    });

    const { data: dataMaxColumn, isLoading: isLoadingMaxColumn } = useFetch({
        name: "maxColumn",
        url: "profiles/add"
    });

    const mutate = useMutation({
        url: "rights/level",
        method: "POST",
        success: (data) => {
            let rights = [];
            for(let right of data.rights){
                let before = [];
                let liste = right.code.split(".");
                if(liste.length > 1){
                    for(let i = 0; i < liste.length - 1; i++){
                        let str = "";
                        for(let j = 0; j < i + 1; j++){
                            if(str != ""){
                                str += ".";
                            }
                            str += liste[j];
                        }
                        before.push(str);
                    }
                    right.before = before;
                } else {
                    right.before = [];
                }
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

    const handleSubmmit = () => {
        setStatus("loading");
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
        mutate.mutate({
            body: {
                right: selected.codes.length > 0 ? selected.codes[selected.codes.length - 1] : undefined
            }
        })
    }, [selected])

    useEffect(() => {
        setCurrentPage({
            title: `Affecter les droits au profil : ${profile.name}`,
            Buttons: [
                <Button link={"/data/profiles"} color="danger">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <FaArrowLeft />
                        Retour
                    </span>
                </Button>,
                <Button onClick={handleSubmmit} color="success" status={status} icon={<FaArrowsAltH />}>
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
                                                    className={`text-white select-none p-2 text-lg  rounded-xl cursor-pointer ${selected.codes.includes(right.code) ? "bg-slate-900/70 hover:bg-slate-800" : "hover:bg-slate-900/70"}`} 
                                                    onClick={() => {
                                                        if(!selected.codes.includes(right.code)){
                                                            setSelected({
                                                                level: index,
                                                                codes : right.before.length > 0 ? [...right.before, right.code] : [right.code]
                                                            })

                                                            setCols((prevCol: any) => 
                                                                prevCol.map((item: Column) => 
                                                                    item.level > index + 1 ? {...item, value: data.rights} :  item
                                                                )
                                                            )
                                                        }
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