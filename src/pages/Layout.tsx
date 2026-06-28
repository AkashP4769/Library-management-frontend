import { Outlet } from "react-router";
import './Layout.css'

import DashboardIcon from "@assets/icons/sidebar_dashboard.svg";


export function Layout() {
    return (
        <div className="layout">
            <aside className="sidebar">
                <h2 className="sidebar-title">Library Management</h2>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <img src={DashboardIcon} alt="Dashboard Icon" className="dashboard-icon" />
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li>
                            <img src={DashboardIcon} alt="Dashboard Icon" className="dashboard-icon" />
                            <a href="/books">Books</a>
                        </li>
                        <li>
                            <img src={DashboardIcon} alt="Dashboard Icon" className="dashboard-icon" />
                            <a href="/members">Members</a>
                        </li>
                    </ul>
                    <button className="ask-ai-button">
                        <img src={DashboardIcon} alt="Ask AI Icon" className="ask-ai-icon" />
                        <p>Ask AI</p>
                    </button>
                </nav>
                <nav className="sidebar-footer">
                    <ul>
                        <li>
                            <img src={DashboardIcon} alt="Settings Icon" className="settings-icon" />
                            <a href="/settings">Settings</a>
                        </li>
                        <li>
                            <img src={DashboardIcon} alt="Logout Icon" className="logout-icon" />
                            <a href="/logout">Logout</a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <Outlet />
        </div>
    );
}