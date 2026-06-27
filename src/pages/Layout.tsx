import { Outlet } from "react-router";


export function Layout() {
    return (
        <div className="layout">
            <header>
                <h1>Library Management System</h1>
            </header>
            <Outlet />
            <footer>
                <p>&copy; 2024 Library Management System</p>
            </footer>
        </div>
    );
}