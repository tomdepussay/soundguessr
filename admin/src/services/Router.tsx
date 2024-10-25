import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout';
import AuthGuard from '@services/AuthGuard';
import AuthLoyout from '@components/AuthLayout';
import Login from '@pages/auth/Login';

import Dashboard from '@pages/Dashboard';

import Animes from '@pages/data/animes/Animes';
import AddAnime from '@pages/data/animes/AddAnime';

import Parts from '@pages/data/parts/Parts';

import Sounds from '@/pages/data/sounds/Sounds';

import Types from '@/pages/data/types/Types';

import Questions from '@/pages/data/questions/Questions';

import Networks from '@/pages/data/networks/Networks';

import Users from '@pages/Users';
import Games from '@pages/Games';

function Router(){
    return (
        <Routes>

            <Route element={<AuthLoyout />} >
                <Route path='login' element={<Login />} />
            </Route>

            
            <Route element={<AuthGuard><Layout /></AuthGuard>} >

                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="data">
                    <Route path='animes'>
                        <Route index element={<Animes />} />
                        <Route path='add' element={<AddAnime />} />
                    </Route>

                    <Route path='parts'>
                        <Route index element={<Parts />} />
                        <Route path='add' element={<div>Ajouter une partie</div>} />
                    </Route>

                    <Route path='sounds'>
                        <Route index element={<Sounds />} />
                        <Route path='add' element={<div>Ajouter un son</div>} />
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