import { Outlet } from "react-router";
import "./AdminLayout.css";

import { Link } from "react-router";
import DashboardIcon from "@assets/icons/sidebar_dashboard.svg";
import CatalogIcon from "@assets/icons/sidebar_catalog.svg";
import SavedIcon from "@assets/icons/sidebar_saved.svg";
import ProfileIcon from "@assets/icons/sidebar_profile.svg";
import InventoryIcon from "@assets/icons/sidebar_inventory.svg";
import SettingsIcon from "@assets/icons/sidebar_setting.svg";
import LogoutIcon from "@assets/icons/sidebar_logout.svg";
import { useState } from "react";
import Chatbot from "@/components/chatbot/Chatbot";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: DashboardIcon },
  { name: "Track", href: "/admin/track", icon: CatalogIcon },
  { name: "Inventory", href: "/admin/inventory", icon: InventoryIcon },
  { name: "Audit", href: "/admin/audit", icon: SavedIcon },
  { name: "Profile", href: "/admin/profile", icon: ProfileIcon },
];

const sidebarFooterLinks = [
  { name: "Settings", href: "/settings", icon: SettingsIcon },
  { name: "Logout", href: "/logout", icon: LogoutIcon },
];

function SidebarLink({
  link,
  selectedLink,
  setSelectedLink,
}: {
  link: { name: string; href: string; icon: string };
  selectedLink: string;
  setSelectedLink: (linkName: string) => void;
}) {
  return (
    <Link
      to={link.href}
      className="w-full"
      key={link.name}
      onClick={() => setSelectedLink(link.name)}
    >
      <li
        key={link.name}
        className={`${selectedLink === link.name ? "bg-tertiary-container text-secondary" : "text-tertiary hover:bg-surface-container duration-200"}`}
      >
        <img
          src={link.icon}
          alt={`${link.name} Icon`}
          className="sidebar-icon"
        />
        <p>{link.name}</p>
      </li>
    </Link>
  );
}

export default function AdminLayout() {
  const [selectedLink, setSelectedLink] = useState<string>("Dashboard");
  const [open, setOpen] = useState(false);
  function handleChatbotComponent() {
    setOpen((prev) => !prev);
  }
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Library Management</h2>
        <nav className="sidebar-nav">
          <ul>
            {sidebarLinks.map((link) => (
              <SidebarLink
                key={link.name}
                link={link}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
              />
            ))}
          </ul>
          <button className="ask-ai-button" onClick={handleChatbotComponent}>
            <img
              src={DashboardIcon}
              alt="Ask AI Icon"
              className="ask-ai-icon"
            />
            <p>Ask AI</p>
          </button>
        </nav>
        <nav className="sidebar-footer">
          <ul>
            {sidebarFooterLinks.map((link) => (
              <SidebarLink
                key={link.name}
                link={link}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
              />
            ))}
          </ul>
        </nav>
      </aside>
      {open && <Chatbot isBotOpen={handleChatbotComponent} />}
      <Outlet />
    </div>
  );
}
