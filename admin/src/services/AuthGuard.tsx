import React, { useContext, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, redirectTo = "/login" }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) {
        // Afficher un indicateur de chargement si les données de l'utilisateur sont en cours de récupération
        return <div>Loading...</div>; // Vous pouvez remplacer cela par un indicateur de chargement plus stylisé
    }

    if (!user &&  !loading) {
        // Si l'utilisateur n'est pas authentifié, redirection vers la page de connexion
        navigate(redirectTo);
    }

    // Si l'utilisateur est authentifié, afficher le contenu enfant
    return <>{children}</>;
};

export default AuthGuard;
