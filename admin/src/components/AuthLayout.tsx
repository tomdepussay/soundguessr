import { Outlet } from "react-router-dom";

function AuthLayout(){
    return (
        <div className="w-screen h-screen flex justify-center items-start sm:items-center overflow-hidden bg-slate-800">

            <div className="p-4 h-full sm:h-auto sm:rounded-2xl sm:border-2 bg-slate-700 shadow-md w-full sm:w-4/6">
                <Outlet />
            </div>
            

        </div>
    )
}

export default AuthLayout;