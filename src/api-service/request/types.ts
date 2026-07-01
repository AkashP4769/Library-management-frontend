export type NotificationType = "REQUEST_BOOK" | "DUE_DATE_REMINDER" | "ADMIN_NOTIFICATION" | "IN_STOCK_NOTIFICATION" | "BOOK_BORROW_ACCEPTED" | "BOOK_BORROW_REJECTED";

export type NotificationRequestPayload = {
    receiver_id?: number;
    book_copy_id?: number;
    message?: string;
    notification_type: NotificationType;
};