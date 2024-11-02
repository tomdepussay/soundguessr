import React, { useState, useContext, createContext } from "react";
import Alert from "@components/Alert";

interface AlertContextType {
    alert: {
        isOpen: boolean;
        message: string;
        onClick: () => void;
    };
    showAlert: (message: string, onClick?: () => void) => void;
    hideAlert: () => void;
}

interface AlertProviderProps {
    children: React.ReactNode;
}

export const AlertContext = createContext<AlertContextType>({
    alert: {
        isOpen: false,
        message: "",
        onClick: () => {}
    },
    showAlert: () => {},
    hideAlert: () => {}
});


export const AlertProvider = ({ children }: AlertProviderProps) => {
    const [alert, setAlert] = useState({
        isOpen: false,
        message: "",
        onClick: () => {}
    });

    const showAlert = (message: string, onClick = () => {}) => {
        setAlert({
            isOpen: true,
            message,
            onClick
        });
    }

    const hideAlert = () => {
        setAlert({
            isOpen: false,
            message: "",
            onClick: () => {}
        });
    }

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {
                alert.isOpen && (
                    <Alert message={alert.message} onClick={alert.onClick} hideAlert={hideAlert} /> 
                )
            }
            {children}
        </AlertContext.Provider>
    )
}