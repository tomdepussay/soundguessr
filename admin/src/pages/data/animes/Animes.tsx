import { useState } from 'react';
import Button from '@components/Button';
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Animes() {

    const navigate = useNavigate();

    return (
        <div className="h-full p-3">
            <div className="w-full h-14 flex justify-between items-center gap-2">
                <Button onClick={() => {
                navigate("/data/animes/add");
                }} color="success" icon={<FaPlus />}>
                    Ajouter un anime
                </Button>
            </div>
        </div>
    )
}   

export default Animes;