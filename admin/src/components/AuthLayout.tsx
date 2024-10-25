import { Outlet } from "react-router-dom";

function AuthLayout(){
    return (
        <div className="w-screen h-screen flex justify-center items-center overflow-hidden bg-slate-800">

            <div className="w-3/6 p-4 rounded-2xl border-2 border-slate-200 bg-slate-700 shadow-md">
                <Outlet />
            </div>
            

        </div>
    )
}

export default AuthLayout;