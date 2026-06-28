import { Outlet } from "react-router";
import './Layout.css'

import DashboardIcon from "@assets/icons/sidebar_dashboard.svg";

const sidebarLinks = [
    { name: "Dashboard", href: "/", icon: DashboardIcon },
    { name: "Catalog", href: "/catalog", icon: DashboardIcon },
    { name: "Shelves", href: "/shelves", icon: DashboardIcon },
    { name: "Saved", href: "/saved", icon: DashboardIcon },
    { name: "Profile", href: "/profile", icon: DashboardIcon },
];

const sidebarFooterLinks = [
    { name: "Settings", href: "/settings", icon: DashboardIcon },
    { name: "Logout", href: "/logout", icon: DashboardIcon },
];

export function Layout() {
    return (
        <div className="layout">
            <aside className="sidebar">
                <h2 className="sidebar-title">Library Management</h2>
                <nav className="sidebar-nav">
                    <ul>
                        {sidebarLinks.map((link) => (
                            <li key={link.name}>
                                <img src={link.icon} alt={`${link.name} Icon`} className="sidebar-icon" />
                                <a href={link.href}>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                    <button className="ask-ai-button">
                        <img src={DashboardIcon} alt="Ask AI Icon" className="ask-ai-icon" />
                        <p>Ask AI</p>
                    </button>
                </nav>
                <nav className="sidebar-footer">
                    <ul>
                        {sidebarFooterLinks.map((link) => (
                            <li key={link.name}>
                                <img src={link.icon} alt={`${link.name} Icon`} className="sidebar-icon" />
                                <a href={link.href}>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <Outlet />
        </div>
    );
}