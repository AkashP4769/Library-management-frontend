export type DashBoardMetrics = {
  total_borrowed: number;
  active_users: number;
  overdue_items: number;
  most_popular_genre: string;
};

export type AuditLogItem = {
  id?: string | number;
  actor_user_id?: string | number;
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
