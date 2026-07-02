import { useLazyGetAuditLogsQuery } from "@/api-service/admin/admin.api";
import type { AuditLogItem, AuditLogResponse } from "@/api-service/admin/types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./Audit.css";

const RANGE_OPTIONS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
] as const;

const ACTION_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Login", value: "login" },
  { label: "Create", value: "create" },
  { label: "Update", value: "update" },
  { label: "Return", value: "return" },
  { label: "Delete", value: "delete" },
] as const;

type Range = (typeof RANGE_OPTIONS)[number]["value"];
type ActionFilter = (typeof ACTION_OPTIONS)[number]["value"];

type NormalizedAuditLog = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  target: string;
  status: string;
  severity: "success" | "warning" | "failed" | "deleted" | "neutral";
  time: string;
  createdAt: string;
  details: string;
  actionType: string;
};

function normalizeAuditResponse(response?: AuditLogResponse): AuditLogItem[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;

  return (
    response.audit_logs ?? response.logs ?? response.results ?? response.data ?? []
  );
}

function toSentence(value?: string): string {
  if (!value) return "Activity recorded";

  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function getSeverity(log: AuditLogItem): NormalizedAuditLog["severity"] {
  const source =
    `${log.status ?? ""} ${log.severity ?? ""} ${log.action_type ?? ""}`.toLowerCase();

  if (
    source.includes("delete") ||
    source.includes("removed") ||
    source.includes("archive")
  ) {
    return "deleted";
  }
  if (source.includes("fail") || source.includes("error")) return "failed";
  if (source.includes("warn") || source.includes("overdue")) return "warning";
  if (
    source.includes("success") ||
    source.includes("complete") ||
    source.includes("login") ||
    source.includes("create") ||
    source.includes("update") ||
    source.includes("return")
  ) {
    return "success";
  }

  return "neutral";
}

function formatAuditTime(value?: string): string {
  if (!value) return "Time unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function normalizeLog(log: AuditLogItem, index: number): NormalizedAuditLog {
  const action = log.action_type ?? log.action ?? log.event;
  const actor = log.actor ?? log.user;
  const status = log.status ?? log.severity;
  const detailsFromMetadata =
    typeof log.metadata?.details === "string" ? log.metadata.details : "";
  const oldStatus =
    typeof log.old_value?.status === "string" ? log.old_value.status : "";
  const newStatus =
    typeof log.new_value?.status === "string" ? log.new_value.status : "";
  const statusChange =
    oldStatus && newStatus && oldStatus !== newStatus
      ? `${toSentence(oldStatus)} to ${toSentence(newStatus)}`
      : "";

  return {
    id: String(log.id ?? `${action ?? "audit"}-${index}`),
    actor: actor || log.actor_user_name || "System",
    action: toSentence(action),
    entity: log.entity_type
      ? toSentence(log.entity_type)
      : log.entity
        ? toSentence(log.entity)
        : "Record",
    target:
      log.target || (log.actor_user_name ? `ID ${log.entity_id}` : "Library system"),
    status:
      getSeverity(log) === "deleted"
        ? "Record"
        : status
          ? toSentence(status)
          : "Recorded",
    severity: getSeverity(log),
    time: formatAuditTime(log.created_at ?? log.timestamp ?? log.date),
    createdAt: log.created_at ?? log.timestamp ?? log.date ?? "",
    details:
      log.details ||
      detailsFromMetadata ||
      statusChange ||
      `${toSentence(action)} event recorded`,
    actionType: (action ?? "").toLowerCase(),
  };
}

function matchesSearch(log: NormalizedAuditLog, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  return Object.values(log).some((value) =>
    String(value).toLowerCase().includes(query),
  );
}

function matchesAction(log: NormalizedAuditLog, actionFilter: ActionFilter) {
  return actionFilter === "all" || log.actionType === actionFilter;
}

function matchesRange(log: NormalizedAuditLog, range: Range): boolean {
  const createdAt = new Date(log.createdAt);
  if (!log.createdAt || Number.isNaN(createdAt.getTime())) return true;

  const days = Number(range.replace("d", ""));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return createdAt >= cutoff;
}

function AuditMetric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "primary" | "success" | "warning" | "failed";
}) {
  return (
    <div className="audit-metric">
      <div className={`audit-metric-icon audit-metric-icon-${tone}`}>
        {icon}
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function AuditSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr className="audit-skeleton-row" key={index}>
          <td>
            <span className="audit-skeleton audit-skeleton-wide" />
          </td>
          <td>
            <span className="audit-skeleton audit-skeleton-medium" />
          </td>
          <td>
            <span className="audit-skeleton audit-skeleton-small" />
          </td>
          <td>
            <span className="audit-skeleton audit-skeleton-medium" />
          </td>
          <td>
            <span className="audit-skeleton audit-skeleton-small" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function AuditPage() {
  const [range, setRange] = useState<Range>("30d");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [search, setSearch] = useState("");

  const [fetchAuditLogs, { data, isLoading, isFetching, isError }] =
    useLazyGetAuditLogsQuery();

  useEffect(() => {
    fetchAuditLogs({ range, status: "all" });
  }, [fetchAuditLogs, range]);

  const normalizedLogs = useMemo(
    () => normalizeAuditResponse(data).map(normalizeLog),
    [data],
  );

  const visibleLogs = useMemo(
    () =>
      normalizedLogs.filter(
        (log) =>
          matchesRange(log, range) &&
          matchesAction(log, actionFilter) &&
          matchesSearch(log, search),
      ),
    [actionFilter, normalizedLogs, range, search],
  );

  const successCount = normalizedLogs.filter(
    (log) => log.severity === "success" || log.severity === "deleted",
  ).length;
  const warningCount = normalizedLogs.filter(
    (log) => log.severity === "warning",
  ).length;
  const failedCount = normalizedLogs.filter(
    (log) => log.severity === "failed",
  ).length;
  const loading = isLoading || isFetching;

  return (
    <main className="audit-page">
      <section className="audit-header">
        <div>
          <span className="audit-eyebrow">Admin controls</span>
          <h1>Audit Log</h1>
          <p>Monitor system changes, access events, and circulation actions.</p>
        </div>

        <button
          className="audit-refresh-button"
          onClick={() => fetchAuditLogs({ range, status: "all" })}
          disabled={loading}
          type="button"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </section>

      <section className="audit-metrics" aria-label="Audit summary">
        <AuditMetric
          icon={<ShieldCheck size={18} />}
          label="Total Events"
          value={normalizedLogs.length}
          tone="primary"
        />
        <AuditMetric
          icon={<CheckCircle2 size={18} />}
          label="Successful"
          value={successCount}
          tone="success"
        />
        <AuditMetric
          icon={<Clock3 size={18} />}
          label="Warnings"
          value={warningCount}
          tone="warning"
        />
        <AuditMetric
          icon={<AlertTriangle size={18} />}
          label="Failed"
          value={failedCount}
          tone="failed"
        />
      </section>

      <section className="audit-panel">
        <div className="audit-toolbar">
          <div className="audit-search">
            <Search size={16} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search actor, action, target"
            />
          </div>

          <div className="audit-controls">
            <div className="audit-segmented" aria-label="Date range">
              {RANGE_OPTIONS.map((option) => (
                <button
                  className={range === option.value ? "is-active" : ""}
                  key={option.value}
                  onClick={() => setRange(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>

            <select
              aria-label="Audit action"
              className="audit-select"
              value={actionFilter}
              onChange={(event) =>
                setActionFilter(event.target.value as ActionFilter)
              }
            >
              {ACTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="audit-table-wrap">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Actor</th>
                <th>Status</th>
                <th>Target</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <AuditSkeleton />
              ) : isError ? (
                <tr>
                  <td colSpan={5}>
                    <div className="audit-state">
                      <AlertTriangle size={24} />
                      <strong>Could not load audit logs</strong>
                      <span>Check that the backend audit endpoint is running.</span>
                    </div>
                  </td>
                </tr>
              ) : visibleLogs.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="audit-state">
                      <Database size={24} />
                      <strong>No audit records found</strong>
                      <span>Try changing the filters or date range.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="audit-event-cell">
                        <span className="audit-event-icon">
                          <Database size={16} />
                        </span>
                        <div>
                          <strong>{log.action}</strong>
                          <span>{log.details}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="audit-actor-cell">
                        <span>
                          <UserRound size={14} />
                        </span>
                        {log.actor}
                      </div>
                    </td>
                    <td>
                      <span className={`audit-status audit-status-${log.severity}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <div className="audit-target-cell">
                        <strong>{log.entity}</strong>
                        <span>{log.target}</span>
                      </div>
                    </td>
                    <td className="audit-time">{log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="audit-footer">
          <span>
            Showing {loading ? "..." : visibleLogs.length} of{" "}
            {normalizedLogs.length} events
          </span>
          <span>{range.toUpperCase()} range</span>
        </div>
      </section>
    </main>
  );
}
