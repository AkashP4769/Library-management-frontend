export type DashBoardMetrics = {
  total_borrowed: number;
  active_users: number;
  overdue_items: number;
  most_popular_genre: string;
};

export type CirculationTrend = {
  date: string;
  borrowed: number;
  returned: number;
  overdue: number;
};

export type RecentActivity = {
  id: number;
  image_url: string | null;
  title: string;
  user: string;
  date: string;
  status: "Issued" | "Borrowed" | "Overdue" | "Returned";
  due_date: string;
};

export type ShelfSageItem = {
  shelf_id: number;
  shelf_name: string;
  utilization_rate: number;
  available_books: number;
  borrowed_books: number;
  overdue_books: number;
};

export type AuditLogItem = {
  id?: string | number;
  actor_user_id?: string | number;
  actor_user_name?:string;
  actor?: string;
  user?: string;
  action_type?: string;
  action?: string;
  event?: string;
  entity_type?: string;
  entity_id?: string | number;
  entity?: string;
  target?: string;
  status?: string;
  severity?: string;
  timestamp?: string;
  created_at?: string;
  date?: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  details?: string;
  metadata?: Record<string, unknown> | null;
};

export type AuditLogResponse =
  | AuditLogItem[]
  | {
      audit_logs?: AuditLogItem[];
      logs?: AuditLogItem[];
      results?: AuditLogItem[];
      data?: AuditLogItem[];
      total?: number;
    };
