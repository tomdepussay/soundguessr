import React, { useState } from 'react';
import Form from '@components/Form';
import FormRow from '@components/FormRow';
import Button from '@components/Button';
import Input from '@components/Input';
import Boolean from '@components/Boolean';
import File from '@components/File';
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";

function AddAnime() {

    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="h-full p-3">
            <div className="w-full h-14 flex justify-between items-center gap-2">
                <h2 className="text-white text-2xl">Ajouter un anime</h2>
                <Button color='danger' icon={<MdArrowBackIos />} onClick={() => {
                    navigate("/data/animes");
                }}>
                    Retour à la liste
                </Button>
            </div>

            <hr className='mt-3 border-slate-700' />

            <Form>
                <FormRow>
                    <Input label="Nom de l'anime (EN)" name="name" status={status} required placeholder="Nom de l'anime" />
                    <Boolean label="Top 100" name="top100" status={status} required />
                </FormRow>
                <FormRow>
                    <File label="Image de l'anime" name="picture" status={status} required />
                </FormRow>
                <FormRow>
                    <Button
                        icon={<FaPlus />}
                        color={status === "error" ? "danger" : "success"}
                        status={status}
                        onClick={(e) => {
                            e.preventDefault();
                            setStatus("pending");
                            setTimeout(() => {
                                setStatus("error");
                                setError("Une erreur s'est produite lors de l'ajout de l'anime");
                            }, 2000);
                        }}
                    >
                        Ajouter l'anime
                    </Button>
                    {
                        error && (
                            <p className='text-red-500 text-sm'>
                                {error}
                            </p>
                        )
                    }
                </FormRow>
            </Form>
        </div>
    )
}

export default AddAnime;