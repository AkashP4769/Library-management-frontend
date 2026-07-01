import { useEffect, useState } from "react";
import star from "@/assets/icons/star.svg";
import users from "@/assets/icons/users.svg";
import book from "@/assets/icons/book.svg";
import alert from "@/assets/icons/alert.svg";
import {
  useGetDashboardMetricsQuery,
  useLazyGetCirculationTrendsQuery,
  useGetShelfSageQuery,
} from "@/api-service/admin/admin.api";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type KpiCard = {
  label: string;
  value?: string | number;
  delta: string;
  deltaTone: "up" | "down" | "neutral";
  iconBg: string;
  icon: string;
};

const kpis: KpiCard[] = [
  {
    label: "Total Borrowed",
    delta: "+4.2%",
    deltaTone: "up",
    iconBg: "bg-[#D9DFF5]",
    icon: book,
  },
  {
    label: "Active Users",
    delta: "+1.8%",
    deltaTone: "up",
    iconBg: "bg-[#D0D7E7]",
    icon: users,
  },
  {
    label: "Overdue Items",
    delta: "-3.1%",
    deltaTone: "down",
    iconBg: "bg-[#FFDAD6]",
    icon: alert,
  },
  {
    label: "Most Popular Genre",
    delta: "This month",
    deltaTone: "neutral",
    iconBg: "bg-[#FCD34D]",
    icon: star,
  },
];

function DeltaPill({
  delta,
  tone,
}: {
  delta: string;
  tone: KpiCard["deltaTone"];
}) {
  const toneClass =
    tone === "up"
      ? "text-[#735C00] bg-[#FCD34D]/20"
      : tone === "down"
        ? "text-[#BA1A1A] bg-[#FFDAD6]/40"
        : "text-[#4D4635] bg-[#F3F4F5]";

  return (
    <span
      className={`px-2 py-[1.5px] rounded-full text-xs font-bold tracking-[0.6px] ${toneClass}`}
    >
      {delta}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const { data: dashboardMetrics } = useGetDashboardMetricsQuery();
  const [
    fetchCirculationTrends,
    { data: circulationTrends = [], isLoading: isCirculationTrendsLoading },
  ] = useLazyGetCirculationTrendsQuery();
  const { data: shelfSage = [] } = useGetShelfSageQuery();
  const kpisWithData = kpis.map((kpi) => {
    switch (kpi.label) {
      case "Total Borrowed":
        return { ...kpi, value: dashboardMetrics?.total_borrowed ?? 0 };
      case "Active Users":
        return { ...kpi, value: dashboardMetrics?.active_users ?? 0 };
      case "Overdue Items":
        return { ...kpi, value: dashboardMetrics?.overdue_items ?? 0 };
      case "Most Popular Genre":
        return { ...kpi, value: dashboardMetrics?.most_popular_genre ?? "N/A" };
      default:
        return kpi;
    }
  });

  useEffect(() => {
    fetchCirculationTrends({ range });
  }, [range]);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1980px] mx-auto w-[90%] overflow-scroll">
      {/* Header Actions */}
      <div className="flex justify-between items-end gap-4">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-[#4D4635]">
            Welcome back — here's what's happening across your library.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg border border-[#D0C6AE] bg-white text-sm font-bold text-[#191C1D] hover:bg-[#F3F4F5] transition">
            Last 30 days
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpisWithData.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col p-6 bg-white border border-[#D0C6AE] rounded-xl"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                <img className="w-4 h-5" src={kpi.icon} />
              </div>
              <DeltaPill delta={kpi.delta} tone={kpi.deltaTone} />
            </div>

            <span className="mt-3 text-xs font-semibold uppercase tracking-[0.6px] text-[#4D4635]">
              {kpi.label}
            </span>

            <span className="mt-1 text-[32px] font-bold leading-[38px] tracking-[-0.64px] text-[#191C1D]">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="lg:grid-cols-[2fr_1fr] gap-6">
        {/* Circulation Trends */}
        <div className="flex flex-col p-6 bg-white border border-[#D0C6AE] rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#191C1D]">
              Circulation Trends
            </h2>

            <div className="flex items-center gap-2">
              {(["7d", "30d", "90d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold tracking-[0.6px] border transition ${
                    range === r
                      ? "bg-[#191C1D] text-white border-[#191C1D]"
                      : "border-[#D0C6AE] text-[#4D4635] hover:bg-[#F3F4F5]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FCD34D]" />
              <span className="text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
                Borrowed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#575E70]" />
              <span className="text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
                Returned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#DC2626]" />
              <span className="text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
                Overdue
              </span>
            </div>
          </div>
          {/* Chart placeholder — swap for Recharts/Chart.js once data is wired up */}
          <div className="relative h-[280px] w-full rounded-lg bg-[#F8F9FA] border border-[#D0C6AE] p-4 ">
            {isCirculationTrendsLoading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-[#4D4635]">Loading...</span>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={circulationTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="borrowed"
                      stroke="#FCD34D"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />

                    <Line
                      type="monotone"
                      dataKey="returned"
                      stroke="#575E70"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />

                    <Line
                      type="monotone"
                      dataKey="overdue"
                      stroke="#DC2626"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-between mt-3 text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
                  {circulationTrends.map((m) => (
                    <span key={m.date}>
                      {new Date(m.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 bg-white border border-[#D0C6AE] rounded-xl">
        <h2 className="text-xl font-semibold text-[#191C1D]">
          Usage By Location
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {shelfSage.map((shelf) => (
            <div
              key={shelf.shelf_id}
              className="p-5 bg-white border border-[#D0C6AE] rounded-xl flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#191C1D]">
                  {shelf.shelf_name}
                </span>
                <span className="text-sm font-bold text-[#4D4635]">
                  {shelf.utilization_rate}%
                </span>
              </div>

              <div className="w-full h-2 bg-[#F3F4F5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FCD34D]"
                  style={{ width: `${shelf.utilization_rate}%` }}
                />
              </div>

              <div className="text-xs text-[#4D4635] flex justify-between">
                <span>{shelf.available_books} available</span>
                <span>{shelf.borrowed_books} borrowed</span>
                <span>{shelf.overdue_books} overdue</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
