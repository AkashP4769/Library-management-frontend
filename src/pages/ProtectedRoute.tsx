import { Navigate, Outlet } from "react-router";


export function ProtectedRoute(){
    const access_token = localStorage.getItem('access_token')
    const refresh_token = localStorage.getItem('refresh_token')
    const authenticated = access_token && refresh_token;

    if (!authenticated) return <Navigate to={"/login"} />

    return <Outlet />
    

}