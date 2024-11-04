import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout';
import DataLayout from '@components/DataLayout';
import AuthGuard from '@services/AuthGuard';
import AuthLoyout from '@components/AuthLayout';
import Login from '@pages/auth/Login';

import Dashboard from '@pages/Dashboard';

import Categories from '@pages/data/categories/Categories';

import Licenses from '@pages/data/licenses/Licenses';
import DetailsLicense from '@pages/data/licenses/DetailsLicense';
import AddLicense from '@pages/data/licenses/AddLicense';
import EditLicense from '@pages/data/licenses/EditLicense';

import Sounds from '@pages/data/sounds/Sounds';
import DetailsSound from '@pages/data/sounds/DetailsSound';
import AddSound from '@pages/data/sounds/AddSound';
import EditSound from '@pages/data/sounds/EditSound';

import Types from '@pages/data/types/Types';

import Questions from '@pages/data/questions/Questions';

import Networks from '@pages/data/networks/Networks';

import Users from '@pages/Users';
import Games from '@pages/Games';

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
                        <Route path='add' element={<div>Ajouter un type</div>} />
                    </Route>

                    <Route path='questions'>
                        <Route index element={<Questions />} />
                        <Route path='add' element={<div>Ajouter une question</div>} />
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