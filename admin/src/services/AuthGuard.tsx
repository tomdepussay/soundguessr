import React, { useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
}

function AuthGuard ({ children }: AuthGuardProps){

    const { user } = useContext(AuthContext);
    const [cookies] = useCookies(["uuid"]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user){
            navigate('/login');
        }
    }, [cookies, navigate]);

    return (
        <>
            {children}
        </>
    )
}

export default AuthGuard;