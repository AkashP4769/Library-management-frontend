export type NotificationType =
  | "REQUEST_BOOK"
  | "DUE_DATE_REMINDER"
  | "ADMIN_NOTIFICATION"
  | "IN_STOCK_NOTIFICATION"
  | "BOOK_BORROW_ACCEPTED"
  | "BOOK_BORROW_REJECTED"
  | "BOOK_RETURN_ACCEPTED"
  | "BOOK_BORROW_REJECTED";

export type NotificationRequestPayload = {
  receiver_id?: number;
  book_copy_id?: number;
  message?: string;
  notification_type: NotificationType;
};

export interface NotificationItem {
  id: number;
  notification_type: string;
  is_read?: boolean;
  created_at?: string;
  sender?: { id: number; name: string; email: string } | null;
  book_copy?: {
    id: number;
    status: string;
    book?: { id: number; title: string; isbn: number } | null;
  } | null;
  message?: string | null;
}
