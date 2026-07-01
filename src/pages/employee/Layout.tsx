import { Outlet } from "react-router";
import "./Layout.css";

import { Link, useLocation, useNavigate } from "react-router";
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
import { useToast } from "@/Components/ui/Toast";
import {
  useLazyGetUsersNotificationsQuery,
  useResolveNotificationMutation,
} from "@/api-service/notifications/notifications.api";
import NotificationsPanel from "@/components/NotificationPanel/NotificationPanel";

// const userNotifications = [
//   {
//     id: 1,
//     receiver_id: 12,
//     sender_id: 14,
//     book_copy_id: 5,
//     message: "sample_message",
//     notification_type: "DUE_DATE_REMINDER",
//   },
//   {
//     id: 2,
//     receiver_id: 13,
//     sender_id: 14,
//     book_copy_id: 6,
//     message: "sample_message",
//     notification_type: "REQUEST_BOOK",
//   },
//   {
//     id: 3,
//     receiver_id: null,
//     sender_id: null,
//     book_copy_id: null,
//     message: "Welcome to the Library",
//     notification_type: "ADMIN_NOTIFICATION",
//   },
//   {
//     id: 4,
//     receiver_id: null,
//     sender_id: 3,
//     book_copy_id: 4,
//     message: "string",
//     notification_type: "IN_STOCK_NOTIFICATION",
//   },
// ];
function getNotificationContent(notification: {
  notification_type: string;
  sender?: {
    id: number;
    name: string;
    email: string;
  } | null;
  book_copy?: {
    id: number;
    status: string;
    book?: {
      id: number;
      title: string;
      isbn: number;
    } | null;
  } | null;
  message?: string | null;
}) {
  const senderName = notification.sender?.name ?? "Someone";
  const bookTitle = notification.book_copy?.book?.title ?? "a book";

  switch (notification.notification_type) {
    case "DUE_DATE_REMINDER":
      return {
        title: "Due Date Reminder",
        message: `Your borrowed copy of "${bookTitle}" is due soon. Please return or renew it on time.`,
        showActions: false,
        viewBookPath: `/catalog/books/${notification.book_copy?.book?.id}`,
      };

    case "ADMIN_NOTIFICATION":
      return {
        title: "Library Update",
        message:
          notification.message ||
          "There is a new update from the library administration.",
        showActions: false,
        viewBookPath: undefined,
      };

    case "REQUEST_BOOK":
      return {
        title: "Book Request",
        message: `${senderName} has requested to borrow your copy of "${bookTitle}".`,
        showActions: true,
        viewBookPath: `/catalog/books/${notification.book_copy?.book?.id}`,
      };

    case "BOOK_BORROW_ACCEPTED":
      return {
        title: "Request Accepted",
        message: `${senderName} accepted your request for "${bookTitle}". You can now coordinate the handoff.`,
        showActions: false,
        viewBookPath: `/catalog/books/${notification.book_copy?.book?.id}`,
      };

    case "BOOK_BORROW_REJECTED":
      return {
        title: "Request Declined",
        message: `${senderName} declined your request for "${bookTitle}".`,
        showActions: false,
        viewBookPath: `/catalog/books/${notification.book_copy?.book?.id}`,
      };

    case "IN_STOCK_NOTIFICATION":
      return {
        title: "Book Available",
        message: `"${bookTitle}" is now back in stock and available to borrow.`,
        showActions: false,
        viewBookPath: `/catalog/books/${notification.book_copy?.book?.id}`,
      };

    default:
      return {
        title: "Notification",
        message:
          notification.message ||
          `There is an update regarding "${bookTitle}".`,
        showActions: false,
        viewBookPath: `/catalog/books/${notification.book_copy?.book?.id}`,
      };
  }
}

const sidebarLinks = [
  { name: "Home", href: "/home", icon: DashboardIcon },
  { name: "Catalog", href: "/catalog", icon: CatalogIcon },
  { name: "Shelves", href: "/shelves", icon: ShelvesIcon },
  { name: "My Reads", href: "/my-reads", icon: SavedIcon },
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
  isLogout = false,
}: {
  link: { name: string; href: string; icon: string };
  selectedLink: string;
  setSelectedLink: (linkName: string) => void;
  onClick?: () => void;
  isLogout?: boolean;
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
        className={`h-10 ${selectedLink === link.name ? "bg-tertiary-container text-secondary" : isLogout ? "logout-link" : "text-tertiary hover:bg-surface-container duration-200"}`}
      >
        <img
          src={link.icon}
          alt={`${link.name} Icon`}
          className={`sidebar-icon ${isLogout ? "sidebar-icon-logout" : ""}`}
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
  const [resolveNotification, { isLoading: isResolving }] =
    useResolveNotificationMutation();
  const [
    getUsersNotifications,
    { data: userNotifications, isLoading: loadingNotifications },
  ] = useLazyGetUsersNotificationsQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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

  useEffect(() => {
    const path = location.pathname;

    if (path === "/home" || path === "/") {
      setSelectedLink("Home");
    } else if (path.startsWith("/catalog")) {
      setSelectedLink("Catalog");
    } else if (path.startsWith("/shelves")) {
      setSelectedLink("Shelves");
    } else if (path.startsWith("/my-reads")) {
      setSelectedLink("My Reads");
    } else if (path.startsWith("/settings")) {
      setSelectedLink("Settings");
    } else {
      setSelectedLink("Home");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      getUsersNotifications();
    }
  }, [getUsersNotifications]);

  function handleChatbotComponent() {
    setOpenChatbot((prev) => !prev);
  }

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  function acceptRequest(notificationId: number) {
    resolveNotification({ notificationId, status: "APPROVED" })
      .unwrap()
      .then(() => {
        toast({
          title: "Request Accepted",
          description: "The book request has been accepted.",
          variant: "success",
        });
        getUsersNotifications(); // Refresh notifications after resolving
      })
      .catch((error) => {
        console.error("Error resolving notification:", error);
        toast({
          title: "Error",
          description: "Failed to accept the request. Please try again.",
          variant: "error",
        });
      });
  }

  function rejectRequest(notificationId: number) {
    resolveNotification({ notificationId, status: "REJECTED" })
      .unwrap()
      .then(() => {
        toast({
          title: "Request Rejected",
          description: "The book request has been rejected.",
          variant: "success",
        });
        getUsersNotifications(); // Refresh notifications after resolving
      })
      .catch((error) => {
        console.error("Error resolving notification:", error);
        toast({
          title: "Error",
          description: "Failed to reject the request. Please try again.",
          variant: "error",
        });
      });
  }

  function handleProfileToggle() {
    setShowProfileBanner((prev) => !prev);
    setShowNotifications(false);
  }
  const handleScan = async (isbn: string) => {
    console.log(isbn);
    try {
      const data = await fetchBook(isbn).unwrap();
      console.log(data);
      setShowScanner(false);

      if (data) {
        toast({
          title: "ISBN scanned",
          description: `Found ${data.title || "book details"} for ISBN ${isbn}.`,
          variant: "success",
        });
        return;
      }

      toast({
        title: "No book found",
        description: `ISBN ${isbn} did not return book details.`,
        variant: "error",
      });
    } catch (error) {
      setShowScanner(false);
      toast({
        title: "Scanner lookup failed",
        description: "Please try scanning again.",
        variant: "error",
      });
      console.error("Error fetching scanned ISBN:", error);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src="/src/assets/favicon.svg"
            alt="Lumina Library"
            className="sidebar-brand-icon"
          />
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
                isLogout={link.name === "Logout"}
              />
            ))}
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="employee-header">
          <div>
            <h3 className="header-title">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                LUMINA
              </Link>{" "}
              &emsp; {">"} &emsp; {selectedLink.toUpperCase()}
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
                {userNotifications?.length}
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
                    <p className="profile-banner-name">
                      {localStorage.getItem("name")}
                    </p>
                  </div>
                </div>
                <div className="profile-banner-body">
                  <Link
                    to="/my-reads"
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
                  <div className="scanner-modal-header">
                    <div>
                      <h2 className="scanner-modal-title">Scan ISBN</h2>
                      <p className="scanner-modal-copy">
                        Place the barcode inside the frame.
                      </p>
                    </div>
                    <span className="scanner-status">
                      <span className="scanner-status-dot" />
                      Camera active
                    </span>
                  </div>
                  <div className="scanner-body">
                    <ISBNScanner onScan={handleScan} />
                    <p className="scanner-hint">
                      Hold steady while Lumina reads the ISBN.
                    </p>
                  </div>
                  <div className="scanner-modal-actions">
                    <button
                      className="scanner-close-button"
                      onClick={() => setShowScanner(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showNotifications && (
              <NotificationsPanel
                notifications={userNotifications}
                isLoading={loadingNotifications}
                onClose={() => setShowNotifications(false)}
                onAccept={(id) => acceptRequest(id)}
                onReject={(id) => rejectRequest(id)}
                // onMarkAllRead={() => markAllRead()} // wire to your mutation
                // onMarkOneRead={(id) => markOneRead(id)} // wire to your mutation
              />
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
