import { Outlet } from "react-router";
import "./Layout.css";

import { Link, useNavigate } from "react-router";
import DashboardIcon from "@assets/icons/sidebar_dashboard.svg";
import CatalogIcon from "@assets/icons/sidebar_catalog.svg";
import ShelvesIcon from "@assets/icons/sidebar_shelves.svg";
import SavedIcon from "@assets/icons/sidebar_saved.svg";
import ProfileIcon from "@assets/icons/sidebar_profile.svg";
import Bell from "@assets/icons/Bell.png";
import BarcodeIcon from "@assets/icons/Barcode.png";
import SettingsIcon from "@assets/icons/sidebar_setting.svg";
import LogoutIcon from "@assets/icons/sidebar_logout.svg";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useLazyGetBookbyOpenLibraryAPIQuery } from "@/api-service/books/books.api";
import Chatbot from "@/components/chatbot/Chatbot";
import ISBNScanner from "@/components/scanner/ISBNScanner";
import { clearAuth } from "@/lib/auth";

const notifications_sample = [
  {
    id: 1,
    receiver_id: 12,
    sender_id: 14,
    book_copy_id: 5,
    message: "sample_message",
    notification_type: "DUE_DATE_REMINDER",
  },
  {
    id: 2,
    receiver_id: 13,
    sender_id: 14,
    book_copy_id: 6,
    message: "sample_message",
    notification_type: "REQUEST_BOOK",
  },
  {
    id: 3,
    receiver_id: null,
    sender_id: null,
    book_copy_id: null,
    message: "Welcome to the Library",
    notification_type: "ADMIN_NOTIFICATION",
  },
  {
    id: 4,
    receiver_id: null,
    sender_id: 3,
    book_copy_id: 4,
    message: "string",
    notification_type: "IN_STOCK_NOTIFICATION",
  },
];

function getNotificationContent(notification: {
  notification_type: string;
  book_copy_id?: number | null;
  sender_id?: number | null;
  message?: string;
}) {
  switch (notification.notification_type) {
    case "DUE_DATE_REMINDER":
      return {
        title: "DUE DATE REMINDER",
        message: `Your book ${notification.book_copy_id} is due.`,
        showActions: false,
        viewBookPath: undefined,
      };
    case "ADMIN_NOTIFICATION":
      return {
        title: "Admin Notification",
        message: notification.message || "You have a new admin notification.",
        showActions: false,
        viewBookPath: undefined,
      };
    case "REQUEST_BOOK":
      return {
        title: "Request Book",
        message: `User ${notification.sender_id} is requesting your book ${notification.book_copy_id}`,
        showActions: true,
        viewBookPath: undefined,
      };
    case "IN_STOCK_NOTIFICATION":
      return {
        title: "In Stock",
        message: `Your requested book ${notification.book_copy_id} is in stock!`,
        showActions: false,
        viewBookPath: `/catalog/books/${notification.book_copy_id}`,
      };
    default:
      return {
        title: "Notification",
        message: notification.message || "You have a new notification.",
        showActions: false,
        viewBookPath: undefined,
      };
  }
}

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
  onClick,
}: {
  link: { name: string; href: string; icon: string };
  selectedLink: string;
  setSelectedLink: (linkName: string) => void;
  onClick?: () => void;
}) {
  return (
    <Link
      to={link.href}
      className="w-full"
      key={link.name}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        setSelectedLink(link.name);

        if (onClick) {
          event.preventDefault();
          onClick();
        }
      }}
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
  const [showScanner, setShowScanner] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string>("Home");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const [openChatbot, setOpenChatbot] = useState(false);
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  const [fetchBook] = useLazyGetBookbyOpenLibraryAPIQuery();
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

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  function handleProfileToggle() {
    setShowProfileBanner((prev) => !prev);
    setShowNotifications(false);
  }
  const handleScan = async (isbn: string) => {
    console.log(isbn);
    const result = await fetchBook(isbn);
    console.log(result.data);

    setShowScanner(false);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/src/assets/favicon.svg" alt="Lumina Library" className="sidebar-brand-icon" />
          <h2 className="sidebar-title">Luminar Library</h2>
        </div>
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
                onClick={link.name === "Logout" ? handleLogout : undefined}
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
              <span className="notification-count">
                {notifications_sample.length}
              </span>
            </button>
            <button
              className="icon-button"
              aria-label="Scan barcode"
              onClick={() => setShowScanner(true)}
            >
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
                    onClick={() => {
                      setShowProfileBanner(false);
                      setSelectedLink("Profile");
                    }}
                  >
                    Go to Profile
                  </Link>
                </div>
              </div>
            )}
            {showScanner && (
              <div className="scanner-overlay">
                <div className="scanner-modal">
                  <h2>Scan ISBN</h2>

                  <ISBNScanner onScan={handleScan} />

                  <button onClick={() => setShowScanner(false)}>Close</button>
                </div>
              </div>
            )}

            {showNotifications && (
              <div className="notification-banner">
                <div className="notification-banner-header">
                  <strong>Notifications</strong>
                </div>
                <ul>
                  {notifications_sample.map((item) => {
                    const content = getNotificationContent(item);

                    return (
                      <li key={item.id}>
                        <h4>{content.title}</h4>
                        <p>{content.message}</p>
                        {content.showActions && (
                          <div className="notification-action-row">
                            <button className="notification-action-btn accept">
                              Accept
                            </button>
                            <button className="notification-action-btn reject">
                              Reject
                            </button>
                          </div>
                        )}
                        {content.viewBookPath && (
                          <div className="notification-action-row">
                            <Link
                              to={content.viewBookPath}
                              className="notification-action-btn accept"
                              onClick={() => setShowNotifications(false)}
                            >
                              View Book
                            </Link>
                          </div>
                        )}
                      </li>
                    );
                  })}
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
