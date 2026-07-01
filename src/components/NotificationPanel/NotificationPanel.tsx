// components/notifications/NotificationsPanel.tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "./NotificationPanel.css";
import type { NotificationItem } from "@/api-service/notifications/types";

const PAGE_SIZE = 5;

function timeAgo(dateString?: string) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getNotificationContent(notification: NotificationItem) {
  const senderName = notification.sender?.name ?? "Someone";
  const bookTitle = notification.book_copy?.book?.title ?? "a book";
  const bookId = notification.book_copy?.book?.id;

  switch (notification.notification_type) {
    case "DUE_DATE_REMINDER":
      return {
        title: "Due Date Reminder",
        message: `Your borrowed copy of "${bookTitle}" is due or overdue. Please return or renew it.`,
        showActions: false,
        actionType: null,
        viewBookPath: bookId ? `/catalog/books/${bookId}` : undefined,
      };

    case "ADMIN_NOTIFICATION":
      return {
        title: "Library Update",
        message:
          notification.message ||
          "There is a new update from the library administration.",
        showActions: false,
        actionType: null,
        viewBookPath: undefined,
      };

    case "REQUEST_BOOK":
      return {
        title: "Borrow Request",
        message: `${senderName} wants to borrow your copy of "${bookTitle}". Approving means you agree to hand it over.`,
        showActions: true,
        actionType: "OWNER_DECISION",
        viewBookPath: bookId ? `/catalog/books/${bookId}` : undefined,
      };

    case "BOOK_RETURN_ACCEPTED":
      return {
        title: "Ready for Pickup",
        message: `${senderName} has released "${bookTitle}" for you. Confirm once you receive it.`,
        showActions: true,
        actionType: "RECEIVER_CONFIRM",
        viewBookPath: bookId ? `/catalog/books/${bookId}` : undefined,
      };

    case "BOOK_BORROW_ACCEPTED":
      return {
        title: "Request Accepted",
        message: `${senderName} accepted your request for "${bookTitle}". Coordinate pickup soon.`,
        showActions: false,
        actionType: null,
        viewBookPath: bookId ? `/catalog/books/${bookId}` : undefined,
      };

    case "BOOK_BORROW_REJECTED":
      return {
        title: "Request Declined",
        message: `${senderName} declined your request for "${bookTitle}".`,
        showActions: false,
        actionType: null,
        viewBookPath: bookId ? `/catalog/books/${bookId}` : undefined,
      };

    case "IN_STOCK_NOTIFICATION":
      return {
        title: "Back in Stock",
        message: `"${bookTitle}" is available again.`,
        showActions: false,
        actionType: null,
        viewBookPath: bookId ? `/catalog/books/${bookId}` : undefined,
      };

    default:
      return {
        title: "Notification",
        message:
          notification.message ||
          `There is an update regarding "${bookTitle}".`,
        showActions: false,
        actionType: null,
        viewBookPath: bookId ? `/catalog/books/${bookId}` : undefined,
      };
  }
}
interface NotificationsPanelProps {
  notifications: NotificationItem[] | undefined;
  isLoading: boolean;
  onClose: () => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: number) => void;
}

export default function NotificationsPanel({
  notifications,
  isLoading,
  onClose,
  onAccept,
  onReject,
  onMarkAllRead,
  onMarkOneRead,
}: NotificationsPanelProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const panelRef = useRef<HTMLDivElement>(null);

  // click-outside-to-close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const list = notifications ?? [];
  const unreadCount = list.filter((n) => !n.is_read).length;
  const visibleList = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;

  return (
    <div
      className="notification-banner"
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
    >
      <div className="notification-banner-header">
        <strong>Notifications</strong>
        {unreadCount > 0 && (
          <button className="notification-mark-all" onClick={onMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-scroll-area">
        {isLoading && (
          <div className="notification-empty-state">Loading notifications…</div>
        )}

        {!isLoading && list.length === 0 && (
          <div className="notification-empty-state">
            <p>You're all caught up 🎉</p>
            <span>No new notifications right now.</span>
          </div>
        )}

        {!isLoading && list.length > 0 && (
          <ul>
            {visibleList.map((item) => {
              const content = getNotificationContent(item);
              return (
                <li
                  key={item.id}
                  className={
                    item.is_read ? "notification-read" : "notification-unread"
                  }
                  onClick={() => !item.is_read && onMarkOneRead(item.id)}
                >
                  <div className="notification-item-header">
                    <h4>{content.title}</h4>
                    <span className="notification-time">
                      {timeAgo(item.created_at)}
                    </span>
                  </div>
                  <p>{content.message}</p>

                  {content.showActions &&
                    content.actionType === "OWNER_DECISION" && (
                      <div className="notification-action-row">
                        <button
                          className="notification-action-btn accept"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept(item.id);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="notification-action-btn reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReject(item.id);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  {content.showActions &&
                    content.actionType === "RECEIVER_CONFIRM" && (
                      <div className="notification-action-row">
                        <button
                          className="notification-action-btn accept"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept(item.id);
                          }}
                        >
                          Confirm Pickup
                        </button>
                      </div>
                    )}
                  {content.viewBookPath && (
                    <div className="notification-action-row">
                      <Link
                        to={content.viewBookPath}
                        className="notification-action-btn accept"
                        onClick={() => onClose()}
                      >
                        View Book
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {hasMore && (
        <button
          className="notification-view-more"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          View more ({list.length - visibleCount} more)
        </button>
      )}
    </div>
  );
}
