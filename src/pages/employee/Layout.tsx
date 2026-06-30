import { Outlet } from "react-router";
import "./Layout.css";

import { Link } from "react-router";
import DashboardIcon from "@assets/icons/sidebar_dashboard.svg";
import CatalogIcon from "@assets/icons/sidebar_catalog.svg";
import ShelvesIcon from "@assets/icons/sidebar_shelves.svg";
import SavedIcon from "@assets/icons/sidebar_saved.svg";
import ProfileIcon from "@assets/icons/sidebar_profile.svg";
import InventoryIcon from "@assets/icons/sidebar_inventory.svg";
import Bell from "@assets/icons/Bell.png";
import BarcodeIcon from "@assets/icons/Barcode.png";
import SettingsIcon from "@assets/icons/sidebar_setting.svg";
import LogoutIcon from "@assets/icons/sidebar_logout.svg";
import { useEffect, useState } from "react";
import Chatbot from "@/components/chatbot/Chatbot";

const notifications = [
  {
    id: 1,
    title: "New book arrived",
    message: "The latest fiction collection is now available.",
  },
  {
    id: 2,
    title: "Return reminder",
    message: "Two borrowed books are due tomorrow.",
  },
  {
    id: 3,
    title: "Books Lost",
    message: "Two borrowed books are not to be found anywhere!",
  },
  {
    id: 4,
    title: "New book arrived",
    message: "The latest autobiography collection is now available.",
  },
];

const sidebarLinks = [
  { name: "Home", href: "/home", icon: DashboardIcon },
  { name: "Catalog", href: "/catalog", icon: CatalogIcon },
  { name: "Shelves", href: "/shelves", icon: ShelvesIcon },
  { name: "My Reads", href: "/my-reads", icon: SavedIcon },
  { name: "Profile", href: "/profile", icon: ProfileIcon },
];

const sidebarFooterLinks = [
  { name: "Settings", href: "/settings", icon: SettingsIcon },
  { name: "Logout", href: "/login", icon: LogoutIcon },
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
        className={`h-10 ${selectedLink === link.name ? "bg-tertiary-container text-secondary" : "text-tertiary hover:bg-surface-container duration-200"}`}
      >
        <img
          src={link.icon}
          alt={`${link.name} Icon`}
          className="sidebar-icon"
        />
        <p className="">{link.name}</p>
      </li>
    </Link>
  );
}

export default function Layout() {
  const [selectedLink, setSelectedLink] = useState<string>("Home");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const [openChatbot, setOpenChatbot] = useState(false);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username") ||
      localStorage.getItem("userName") ||
      localStorage.getItem("email") ||
      "User";

    const displayName = storedUsername.includes("@")
      ? storedUsername.split("@")[0]
      : storedUsername;

    setUsername(displayName);
  }, []);

  function handleChatbotComponent() {
    setOpenChatbot((prev) => !prev);
  }

  function handleProfileToggle() {
    setShowProfileBanner((prev) => !prev);
    setShowNotifications(false);
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

      <div className="main-content">
        <header className="employee-header">
          <div>
            <h3 className="header-title">
              LUMINA &emsp; {">"} &emsp; {selectedLink.toUpperCase()}
            </h3>
          </div>

          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setShowNotifications((value) => !value)}
              aria-label="Toggle notifications"
            >
              <span className="notification-bell">
                {" "}
                <img src={Bell} alt="Bell" className="header-icon" />
              </span>
              <span className="notification-count">{notifications.length}</span>
            </button>
            <button className="icon-button" aria-label="Scan barcode">
              <img
                src={BarcodeIcon}
                alt="Barcode"
                className="header-icon"
                id="barcode-icon"
              />
            </button>
            <button
              className="icon-button"
              onClick={handleProfileToggle}
              aria-label="Open profile"
            >
              <img src={ProfileIcon} alt="Profile" className="header-icon" />
            </button>

            {showProfileBanner && (
              <div className="profile-banner">
                <div className="profile-banner-header">
                  <div className="profile-banner-avatar">
                    <img src={ProfileIcon} alt="Profile avatar" />
                  </div>
                  <div>
                    <strong>Profile</strong>
                    <p className="profile-banner-name">{username}</p>
                  </div>
                </div>
                <div className="profile-banner-body">
                  <Link
                    to="/profile"
                    className="profile-banner-button"
                    onClick={() =>{setShowProfileBanner(false);
                        setSelectedLink("Profile")
                    } }
                  >
                    Go to Profile
                  </Link>
                </div>
              </div>
            )}

            {showNotifications && (
              <div className="notification-banner">
                <div className="notification-banner-header">
                  <strong>Notifications</strong>
                </div>
                <ul>
                  {notifications.map((item) => (
                    <li key={item.id}>
                      <h4>{item.title}</h4>
                      <p>{item.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </header>

        <div className="page-content">
          <Outlet />
          {openChatbot && <Chatbot isBotOpen={handleChatbotComponent} />}
        </div>
      </div>
    </div>
  );
}
