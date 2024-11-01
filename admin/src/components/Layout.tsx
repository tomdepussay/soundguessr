import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { Toaster } from "react-hot-toast";

function Layout(){

    const [open, setOpen] = useState(false);

    return (
        <div className="w-screen min-h-screen bg-slate-800 md:flex">
            <Toaster position="bottom-right" reverseOrder={false} />
            
            <Nav open={open} setOpen={setOpen} />

            <main className={`flex-1 pb-20 md:pb-0`}>
                
                <Outlet />

            </main>

        </div>
    )
}

export default Layout;