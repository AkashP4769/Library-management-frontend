import { useState } from "react";
import star from "@/assets/icons/star.svg";
import users from "@/assets/icons/users.svg";
import book from "@/assets/icons/book.svg";
import alert from "@/assets/icons/alert.svg";

type KpiCard = {
  label: string;
  value: string;
  delta: string;
  deltaTone: "up" | "down" | "neutral";
  iconBg: string;
  icon: string;
};

type ActivityRow = {
  id: string;
  title: string;
  initials: string;
  initialsBg: string;
  user: string;
  date: string;
  status: "Returned" | "Borrowed" | "Overdue" | "Reserved";
};

const kpis: KpiCard[] = [
  {
    label: "Total Borrowed",
    value: "12,842",
    delta: "+4.2%",
    deltaTone: "up",
    iconBg: "bg-[#D9DFF5]",
    icon: book,
  },
  {
    label: "Active Users",
    value: "4,210",
    delta: "+1.8%",
    deltaTone: "up",
    iconBg: "bg-[#D0D7E7]",
    icon: users,
  },
  {
    label: "Overdue Items",
    value: "156",
    delta: "-3.1%",
    deltaTone: "down",
    iconBg: "bg-[#FFDAD6]",
    icon: alert,
  },
  {
    label: "Most Popular Genre",
    value: "Sci-Fi",
    delta: "This month",
    deltaTone: "neutral",
    iconBg: "bg-[#FCD34D]",
    icon: star,
  },
];

const locationUsage = [
  { name: "NetherLands", percent: 42, color: "bg-[#FCD34D]" },
  { name: "", percent: 28, color: "bg-[#D9DFF5]" },
  { name: "France", percent: 18, color: "bg-[#D0D7E7]" },
  { name: "Germany", percent: 12, color: "bg-[#7F7662]" },
];

const activityRows: ActivityRow[] = [
  {
    id: "1",
    title: "The Midnight Library",
    initials: "JC",
    initialsBg: "bg-[#D9DFF5]",
    user: "J. Carter",
    date: "Jun 28, 2026",
    status: "Returned",
  },
  {
    id: "2",
    title: "Dune",
    initials: "AM",
    initialsBg: "bg-[#FCD34D]",
    user: "A. Mehta",
    date: "Jun 27, 2026",
    status: "Borrowed",
  },
  {
    id: "3",
    title: "Klara and the Sun",
    initials: "RS",
    initialsBg: "bg-[#D0D7E7]",
    user: "R. Singh",
    date: "Jun 20, 2026",
    status: "Overdue",
  },
  {
    id: "4",
    title: "Project Hail Mary",
    initials: "—",
    initialsBg: "bg-[#E1E3E4]",
    user: "Unassigned",
    date: "Jun 30, 2026",
    status: "Reserved",
  },
];

const statusStyles: Record<ActivityRow["status"], string> = {
  Returned: "bg-[#DCFCE7] text-[#15803D]",
  Borrowed: "bg-[#FEF9C3] text-[#A16207]",
  Overdue: "bg-[#FEE2E2] text-[#B91C1C]",
  Reserved: "bg-[#FEF9C3] text-[#A16207]",
};

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

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1280px] mx-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-end gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-[#4D4635]">
            Welcome back — here's what's happening across your library.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg border border-[#D0C6AE] bg-white text-sm font-bold text-[#191C1D] hover:bg-[#F3F4F5] transition">
            Last 30 days
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#FCD34D] text-sm font-bold text-[#574500] shadow-sm hover:bg-[#F5C843] transition">
            Export report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
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
          </div>

          {/* Chart placeholder — swap for Recharts/Chart.js once data is wired up */}
          <div className="relative h-[280px] w-full rounded-lg bg-[#F8F9FA] border border-dashed border-[#D0C6AE] flex items-center justify-center">
            <span className="text-sm text-[#4D4635]">
              Chart goes here (e.g. Recharts LineChart)
            </span>
          </div>

          <div className="flex justify-between mt-3 text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Usage by Location */}
        <div className="flex flex-col gap-8 p-6 bg-white border border-[#D0C6AE] rounded-xl">
          <h2 className="text-xl font-semibold text-[#191C1D]">
            Usage by Location
          </h2>

          <div className="flex flex-col gap-6">
            {locationUsage.map((loc) => (
              <div key={loc.name} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#191C1D]">{loc.name}</span>
                  <span className="text-[#4D4635]">{loc.percent}%</span>
                </div>

                <div className="relative h-3 w-full rounded-full bg-[#F3F4F5] overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 bottom-0 rounded-full ${loc.color}`}
                    style={{ width: `${loc.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 p-6 bg-[#F8F9FA] border border-dashed border-[#D0C6AE] rounded-lg">
            <span className="text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
              PRO TIP
            </span>
            <p className="text-sm leading-[18px] text-[#191C1D]">
              Central Wing traffic peaks between 2–4 PM. Consider shifting
              staffing from East Digital Lab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
