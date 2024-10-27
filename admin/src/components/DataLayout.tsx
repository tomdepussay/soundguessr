import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { DataContext } from "@services/DataContext";


function Layout() {

    const [currentPage, setCurrentPage] = useState<{title: string; Buttons: React.ReactNode[];}>({
        title: "",
        Buttons: []
    });

    return (
        <DataContext.Provider value={{ setCurrentPage }}>
            <div className="flex flex-col md:h-screen">
                <div className="bg-slate-800 shadow-lg p-3 flex justify-between">
                    <h2 className="text-xl md:text-3xl font-semibold text-white p-2">
                        {currentPage.title}
                    </h2>
                    <div className="flex gap-3 justify-center items-center">
                        {
                            currentPage.Buttons.map((Button, index) => (
                                <React.Fragment key={index}>
                                    {Button}
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
                <div className="p-3 flex flex-column md:overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </DataContext.Provider>
    )
}

export default Layout;