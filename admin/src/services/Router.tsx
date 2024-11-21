import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Layout from '@components/Layout';
import DataLayout from '@components/DataLayout';
import AuthGuard from '@services/AuthGuard';
import AuthLoyout from '@components/AuthLayout';
import Login from '@pages/auth/Login';

import Dashboard from '@pages/Dashboard';

import Categories from '@pages/data/categories/Categories';
import DetailsCategory from '@pages/data/categories/DetailsCategory';
import AddCategory from '@pages/data/categories/AddCategory';
import EditCategory from '@pages/data/categories/EditCategory';

import Licenses from '@pages/data/licenses/Licenses';
import DetailsLicense from '@pages/data/licenses/DetailsLicense';
import AddLicense from '@pages/data/licenses/AddLicense';
import EditLicense from '@pages/data/licenses/EditLicense';

import Sounds from '@pages/data/sounds/Sounds';
import DetailsSound from '@pages/data/sounds/DetailsSound';
import AddSound from '@pages/data/sounds/AddSound';
import EditSound from '@pages/data/sounds/EditSound';

import Types from '@pages/data/types/Types';
import DetailsType from '@pages/data/types/DetailsType';
import AddType from '@pages/data/types/AddType';
import EditType from '@pages/data/types/EditType';

import Questions from '@pages/data/questions/Questions';

import Networks from '@pages/data/networks/Networks';

import Users from '@pages/Users';
import Games from '@pages/Games';
import Profiles from '@/pages/data/profiles/Profiles';
import DetailsProfile from '@/pages/data/profiles/DetailsProfile';
import AddProfile from '@/pages/data/profiles/AddProfile';
import EditProfile from '@/pages/data/profiles/EditProfile';
import Rights from '@/pages/data/rights/Rights';
import DetailsRight from '@/pages/data/rights/DetailsRight';
import AddRight from '@/pages/data/rights/AddRight';
import EditRight from '@/pages/data/rights/EditRight';
import RightsProfile from '@/pages/data/profiles/RightsProfile';

function Router(){

    const { hasPermission } = useContext(AuthContext);

    return (
        <Routes>

            <Route element={<AuthLoyout />}>
                <Route path='login' element={<Login />} />
            </Route>

            <Route element={
                <AuthGuard redirectTo="/login">
                    <Layout />
                </AuthGuard>
            }>

                <Route path='/' element={<Dashboard />} />

                {
                    hasPermission("admin") && ( 
                        <>
                            <Route path="dashboard" element={<Dashboard />} />

                            {
                                hasPermission("admin.data") && (
                                <Route element={<DataLayout />} path="data">
                                    {
                                        hasPermission("admin.data.categories") && (
                                            <Route path='categories'>
                                                <Route index element={<Categories />} />
                                                {
                                                    hasPermission("admin.data.categories.details") && (
                                                        <Route path={`:id`} element={<DetailsCategory />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.categories.add") && (
                                                        <Route path={`add`} element={<AddCategory />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.categories.edit") && (
                                                        <Route path={`edit/:id`} element={<EditCategory />} />
                                                    )
                                                }
                                            </Route>
                                        )
                                    }

                                    {
                                        hasPermission("admin.data.licenses") && (
                                            <Route path='licenses'>
                                                <Route index element={<Licenses />} />
                                                {
                                                    hasPermission("admin.data.licenses.details") && (
                                                        <Route path={`:id`} element={<DetailsLicense />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.licenses.add") && (
                                                        <Route path={`add`} element={<AddLicense />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.licenses.edit") && (
                                                        <Route path={`edit/:id`} element={<EditLicense />} />
                                                    )
                                                }
                                            </Route>
                                        )
                                    }

                                    {
                                        hasPermission("admin.data.sounds") && (
                                            <Route path='sounds'>
                                                <Route index element={<Sounds />} />
                                                {
                                                    hasPermission("admin.data.sounds.details") && (
                                                        <Route path={`:id`} element={<DetailsSound />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.sounds.add") && (
                                                        <Route path={`add`} element={<AddSound />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.sounds.edit") && (
                                                        <Route path={`edit/:id`} element={<EditSound />} />
                                                    )
                                                }
                                            </Route>
                                        )
                                    }
                                    
                                    {
                                        hasPermission("admin.data.types") && (
                                            <Route path='types'>
                                                <Route index element={<Types />} />
                                                {
                                                    hasPermission("admin.data.types.details") && (
                                                        <Route path={`:id`} element={<DetailsType />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.types.add") && (
                                                        <Route path={`add`} element={<AddType />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.types.edit") && (
                                                        <Route path={`edit/:id`} element={<EditType />} />
                                                    )
                                                }
                                            </Route>
                                        )
                                    }

                                    {/* <Route path='questions'>
                                        <Route index element={<Questions />} />
                                        <Route path='add' element={<div>Ajouter une question</div>} />
                                    </Route> */}

                                    {
                                        hasPermission("admin.data.profiles") && (
                                            <Route path="profiles">
                                                <Route index element={<Profiles />} />
                                                {
                                                    hasPermission("admin.data.profiles.details") && (
                                                        <Route path={`:id`} element={<DetailsProfile />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.profiles.add") && (
                                                        <Route path={`add`} element={<AddProfile />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.profiles.edit") && (
                                                        <Route path={`edit/:id`} element={<EditProfile />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.profiles.rights") && (
                                                        <Route path={`rights/:id`} element={<RightsProfile />} />
                                                    )
                                                }
                                            </Route>
                                        )
                                    }
                                    
                                    {
                                        hasPermission("admin.data.rights") && (
                                            <Route path="rights">
                                                <Route index element={<Rights />} />
                                                {
                                                    hasPermission("admin.data.rights.details") && (
                                                        <Route path={`:id`} element={<DetailsRight />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.rights.add") && (
                                                        <Route path={`add`} element={<AddRight />} />
                                                    )
                                                }
                                                {
                                                    hasPermission("admin.data.rights.edit") && (
                                                        <Route path={`edit/:id`} element={<EditRight />} />
                                                    )
                                                }
                                            </Route>
                                        )
                                    }

                                    {/* <Route path='networks'>
                                        <Route index element={<Networks />} />
                                        <Route path='add' element={<div>Ajouter un réseau social</div>} />
                                    </Route> */}
                                </Route>
                                )
                            }

                            {
                                hasPermission("admin.users") && (
                                <Route path="users" element={<Users />} />
                                )
                            }

                            {
                                hasPermission("admin.games") && (
                                <Route path="games" element={<Games />} />
                                )
                            }


                        </>
                    )
                }
                <Route path="*" element={<div>404</div>} />
            </Route>
        </Routes>
    )
}

export default Router;