import { Outlet } from "react-router";


export function AdminLayout() {
    return (
        <div className="admin-layout">
            <header>
                <h1>Admin Dashboard</h1>
            </header>
            <Outlet />
            <footer>
                <p>&copy; 2024 Library Management System</p>
            </footer>
        </div>
    );
}