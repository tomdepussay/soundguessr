import React, { useState } from 'react';
import Loader from '@components/Loader';
import { MdCheck, MdError } from "react-icons/md";

const backgroundColors = {
    default: 'bg-slate-600',
    primary: 'bg-blue-700',
    secondary: 'bg-gray-700',
    danger: 'bg-red-700',
    warning: 'bg-yellow-700',
    success: 'bg-green-700',
    info: 'bg-cyan-700',
}

const backgroundColorsHover = {
    default: 'hover:bg-slate-700',
    primary: 'hover:bg-blue-800',
    secondary: 'hover:bg-gray-600',
    danger: 'hover:bg-red-800',
    warning: 'hover:bg-yellow-800',
    success: 'hover:bg-green-800',
    info: 'hover:bg-cyan-800',
}

const backgroundColorsActive = {
    default: 'active:bg-slate-800',
    primary: 'active:bg-blue-900',
    secondary: 'active:bg-gray-500',
    danger: 'active:bg-red-900',
    warning: 'active:bg-yellow-900',
    success: 'active:bg-green-900',
    info: 'active:bg-cyan-900',
}

const backgroundColorsDisabled = {
    default: 'disabled:bg-slate-500',
    primary: 'disabled:bg-blue-500',
    secondary: 'disabled:bg-gray-500',
    danger: 'disabled:bg-red-500',
    warning: 'disabled:bg-yellow-500',
    success: 'disabled:bg-green-500',
    info: 'disabled:bg-cyan-500',
}

interface ButtonProps {
    children: string;
    color?: 'default' | 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
    disabled?: boolean;
    status?: string;
    icon?: React.ReactNode;
    onClick: (e: React.FormEvent<HTMLButtonElement>) => void;
}

function Button({ children, color = "default", disabled = false, status = "idle", icon, onClick }: ButtonProps){
    return (
        <button
            type='button'
            disabled={disabled || status !== "idle"}
            className={`flex justify-center gap-2 items-center shadow-md p-3 px-3 select-none rounded-xl text-white ${disabled || status !== "idle" ? `${backgroundColorsDisabled[color]} cursor-not-allowed` : `${backgroundColors[color]} ${backgroundColorsHover[color]} ${backgroundColorsActive[color]}`}`}
            onClick={status === "idle" ? onClick : undefined}
        >
            {
                status === "pending" ? (
                    <Loader />
                ) : status === "success" ? (
                    <MdCheck className='text-2xl' />
                ) : status === "error" ? (
                    <MdError className='text-2xl' />
                ) : status === "idle" && icon ? (
                    icon
                ) : null
            }
            {children}
        </button>
    )
}

export default Button;