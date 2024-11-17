import React, { useState, useEffect, useContext } from 'react';
import useFetch from '@services/useFetch';
import useMutation from '@/services/useMutation';
import useDebounce from '@/services/useDebounce';
import PreTable from '@components/PreTable';
import Table from '@components/Table';
import TableCaption from '@components/TableCaption';
import TableHeader from '@components/TableHeader';
import TableBody from '@components/TableBody';
import TableRow from '@components/TableRow';
import TableCell from '@components/TableCell';
import Loader from '@components/Loader';
import Button from '@components/Button';
import { FaEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { DataContext } from '@/services/DataContext';
import { AlertContext } from '@services/AlertContext';
import { MdAdd } from "react-icons/md";
import toast from 'react-hot-toast';
import { IoMdSwitch } from "react-icons/io";

function Profiles() {

    const { setCurrentPage } = useContext(DataContext);
    const { showAlert, hideAlert } = useContext(AlertContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const { data, isLoading, refetch } = useFetch({ name: ["profiles", { page, debouncedSearch }], 
        url: `profiles?page=${page}&search=${debouncedSearch}` 
    });

    const mutation = useMutation({
        url: `profiles`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                refetch();
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Erreur lors de la suppression du profils");
            console.error("Erreur lors de la suppression du profils", error);
        }
    })

    const mutationActive = useMutation({
        url: `categories/active`,
        method: "PATCH",
        success: (data) => {
            if(data.success){
                hideAlert();
                toast.success(data.message);
                refetch();
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Erreur lors de la modification de la catégorie");
            console.error("Erreur lors de la modification de la catégorie", error);
        }
    });

    useEffect(() => {
        if(data){
            setProfiles(data.profiles.data);
            setTotalPages(data.profiles.meta.lastPage);
            setTotal(data.profiles.meta.total);
        }
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage({
            title: "Gestion des profils",
            Buttons: [
                <Button link={"/data/profiles/add"} color="success">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <MdAdd />
                        <span className='hidden md:block'>
                            Ajouter un profil
                        </span>
                    </span>
                </Button>
            ]
        });
    }, []);

    return (
        <div className="flex-1 flex flex-col overflow-x-hidden">
            <PreTable 
                search={search} 
                setSearch={(e: React.ChangeEvent<HTMLInputElement>) => {setSearch(e.target.value);}} 
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />

            {
                profiles.length === 0 && !isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white font-semibold">
                        <p className="text-2xl">Aucune profil trouvé.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Table>
                        <TableCaption>
                            {total} profil(s) sur {totalPages} page(s)
                        </TableCaption>
                        <TableHeader>
                            <TableCell important>Nom</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Nb utilisateurs</TableCell>
                            <TableCell important></TableCell>
                        </TableHeader>

                        {
                            profiles.map((profile, index) => (
                                <TableBody key={index} index={index}>
                                    <TableRow key={profile.id} index={index}>
                                        <TableCell important>{profile.name}</TableCell>
                                        <TableCell border>
                                            {
                                                profile.description ? profile.description : "Aucune description"
                                            }
                                        </TableCell>
                                        <TableCell border>
                                            {
                                                profile.users_count
                                            }
                                        </TableCell>
                                        <TableCell important border>
                                            <div className="flex gap-2 justify-start items-center">
                                                <Button link={`/data/profiles/${profile.id}`} color="info">
                                                    <FaEye />
                                                </Button>
                                                <Button link={`/data/profiles/edit/${profile.id}`} color='success'>
                                                    <FaEdit />
                                                </Button>
                                                <Button onClick={() => {
                                                    showAlert(`Voulez-vous vraiment supprimer le profil "${profile.name}" ?`, () => {
                                                        
                                                        mutation.mutate({ param: profile.id });
                                                    });
                                                }} color='danger'>
                                                    <FaRegTrashAlt />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))
                        }
                    </Table>
                )
            }
        </div>
    )
}

export default Profiles;