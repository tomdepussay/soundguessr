import Button from "@/components/Button";
import { DataContext } from "@/services/DataContext";
import useFetch from "@/services/useFetch";
import React, { useState, useEffect, useContext } from "react";
import { FaArrowLeft, FaArrowsAltH } from "react-icons/fa";
import { useParams } from "react-router-dom";

interface Profile {
    id: number;
    name: string;
    description: string | null;
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

    const { data, isLoading } = useFetch({ 
        name: "profile", 
        url: `profiles/${id}`
    });

    const handleSubmmit = () => {
        setStatus("loading");
    }

    useEffect(() => {
        if(data && data.success){
            setProfile(data.profile);
        }
    }, [data]);

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
        <div>
        </div>
    )
}

export default RightsProfile;