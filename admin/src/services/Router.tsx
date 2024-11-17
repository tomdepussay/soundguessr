import { Routes, Route } from 'react-router-dom';
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
    return (
        <Routes>

            <Route element={<AuthLoyout />} >
                <Route path='login' element={<Login />} />
            </Route>

            <Route element={
                <AuthGuard redirectTo="/login">
                    <Layout />
                </AuthGuard>
            } >

                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route element={<DataLayout />} path="data">
                    <Route path='categories'>
                        <Route index element={<Categories />} />
                        <Route path={`:id`} element={<DetailsCategory />} />
                        <Route path={`add`} element={<AddCategory />} />
                        <Route path={`edit/:id`} element={<EditCategory />} />
                    </Route>

                    <Route path='licenses'>
                        <Route index element={<Licenses />} />
                        <Route path={`:id`} element={<DetailsLicense />} />
                        <Route path={`add`} element={<AddLicense />} />
                        <Route path={`edit/:id`} element={<EditLicense />} />
                        
                    </Route>

                    <Route path='sounds'>
                        <Route index element={<Sounds />} />
                        <Route path={`:id`} element={<DetailsSound />} />
                        <Route path={`add`} element={<AddSound />} />
                        <Route path={`edit/:id`} element={<EditSound />} />
                    </Route>

                    <Route path='types'>
                        <Route index element={<Types />} />
                        <Route path={`:id`} element={<DetailsType />} />
                        <Route path={`add`} element={<AddType />} />
                        <Route path={`edit/:id`} element={<EditType />} />                        
                    </Route>

                    <Route path='questions'>
                        <Route index element={<Questions />} />
                        <Route path='add' element={<div>Ajouter une question</div>} />
                    </Route>

                    <Route path="profiles">
                        <Route index element={<Profiles />} />
                        <Route path={`:id`} element={<DetailsProfile />} />
                        <Route path={`add`} element={<AddProfile />} />
                        <Route path={`edit/:id`} element={<EditProfile />} /> 
                        <Route path={`rights/:id`} element={<RightsProfile />} />
                    </Route>

                    <Route path="rights">
                        <Route index element={<Rights />} />
                        <Route path={`:id`} element={<DetailsRight />} />
                        <Route path={`add`} element={<AddRight />} />
                        <Route path={`edit/:id`} element={<EditRight />} /> 
                    </Route>

                    <Route path='networks'>
                        <Route index element={<Networks />} />
                        <Route path='add' element={<div>Ajouter un réseau social</div>} />
                    </Route>
                </Route>

                <Route path="users" element={<Users />} />
                <Route path="games" element={<Games />} />


                <Route path="*" element={<div>404</div>} />

            </Route>
        </Routes>
    )
}

export default Router;