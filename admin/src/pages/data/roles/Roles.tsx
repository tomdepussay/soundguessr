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
import { FaEdit, FaRegTrashAlt, FaEye, FaArrowsAltH } from "react-icons/fa";
import { DataContext } from '@/services/DataContext';
import { AlertContext } from '@services/AlertContext';
import { MdAdd } from "react-icons/md";
import toast from 'react-hot-toast';
import { AuthContext } from '@/services/AuthContext';

function Roles() {

    const { hasPermission } = useContext(AuthContext);
    const { setCurrentPage } = useContext(DataContext);
    const { showAlert, hideAlert } = useContext(AlertContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [roles, setRoles] = useState<Role[]>([]);

    const { data, isLoading, refetch } = useFetch({ name: ["roles", { page, debouncedSearch }], 
        url: `roles?page=${page}&search=${debouncedSearch}` 
    });

    const mutation = useMutation({
        url: `roles`,
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
            toast.error("Erreur lors de la suppression du rôle");
            console.error("Erreur lors de la suppression du rôle", error);
        }
    })

    useEffect(() => {
        if(data){
            setRoles(data.roles.data);
            setTotalPages(data.roles.meta.lastPage);
            setTotal(data.roles.meta.total);
        }
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage({
            title: "Gestion des rôles",
            Buttons: [
                <Button label='Ajouter un rôle' visible={hasPermission("admin.data.roles.add")} link={"/data/roles/add"} color="success">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <MdAdd />
                        <span className='hidden md:block'>
                            Ajouter un rôle
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
                roles.length === 0 && !isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white font-semibold">
                        <p className="text-2xl">Aucune rôle trouvé.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Table>
                        <TableCaption>
                            {total} rôle(s) sur {totalPages} page(s)
                        </TableCaption>
                        <TableHeader>
                            <TableCell important>Nom</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Nb utilisateurs</TableCell>
                            <TableCell important></TableCell>
                        </TableHeader>

                        {
                            roles.map((role, index) => (
                                <TableBody key={index} index={index}>
                                    <TableRow key={role.id} index={index}>
                                        <TableCell important>{role.name}</TableCell>
                                        <TableCell border>
                                            {
                                                role.description ? role.description : "Aucune description"
                                            }
                                        </TableCell>
                                        <TableCell border>
                                            {
                                                role.users_count
                                            }
                                        </TableCell>
                                        <TableCell important border>
                                            <div className="flex gap-2 justify-start items-center">
                                                <Button label='Voir les détails du rôle' visible={hasPermission("admin.data.roles.details")} link={`/data/roles/${role.id}`} color="info">
                                                    <FaEye />
                                                </Button>
                                                <Button label='Modifier le rôle' visible={hasPermission("admin.data.roles.edit")} link={`/data/roles/edit/${role.id}`} color='success'>
                                                    <FaEdit />
                                                </Button>
                                                <Button label='Supprimer le rôle' visible={hasPermission("admin.data.roles.delete")} onClick={() => {
                                                    showAlert(`Voulez-vous vraiment supprimer le rôle "${role.name}" ?`, () => {
                                                        
                                                        mutation.mutate({ param: role.id });
                                                    });
                                                }} color='danger'>
                                                    <FaRegTrashAlt />
                                                </Button>
                                                <Button label='Affecter des droits au rôle' visible={hasPermission("admin.data.roles.affect")} link={`/data/roles/affect/${role.id}`} color="warning">
                                                    <FaArrowsAltH />
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

export default Roles;