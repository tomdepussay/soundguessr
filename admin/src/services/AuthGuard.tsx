import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
    children: React.ReactNode;
}

function AuthGuard ({ children }: AuthGuardProps){
    
    const [cookies] = useCookies(["uuid"]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!cookies.uuid){
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