const activityRows = [
  {
    id: 1,
    title: "Clean Code",
    user: "Alice Johnson",
    initials: "AJ",
    initialsBg: "bg-[#D9DFF5]",
    date: "30 Jun 2026",
    status: "Issued",
    action: "Borrowed",
    dueDate: "14 Jul 2026",
  },
  {
    id: 2,
    title: "Design Patterns",
    user: "Bob Smith",
    initials: "BS",
    initialsBg: "bg-[#FCD34D]",
    date: "29 Jun 2026",
    status: "Pending",
    action: "Waitlisted",
    dueDate: "-",
  },
  {
    id: 3,
    title: "Database Systems",
    user: "Charlie Lee",
    initials: "CL",
    initialsBg: "bg-[#D0D7E7]",
    date: "27 Jun 2026",
    status: "Overdue",
    action: "Not Returned",
    dueDate: "25 Jun 2026",
  },
  {
    id: 4,
    title: "Operating Systems",
    user: "Diana Ray",
    initials: "DR",
    initialsBg: "bg-[#E1E3E4]",
    date: "26 Jun 2026",
    status: "Returned",
    action: "Returned",
    dueDate: "-",
  },
  {
    id: 2,
    title: "Design Patterns",
    user: "Bob Smith",
    initials: "BS",
    initialsBg: "bg-[#FCD34D]",
    date: "29 Jun 2026",
    status: "Pending",
    action: "Waitlisted",
    dueDate: "-",
  },
  {
    id: 3,
    title: "Database Systems",
    user: "Charlie Lee",
    initials: "CL",
    initialsBg: "bg-[#D0D7E7]",
    date: "27 Jun 2026",
    status: "Overdue",
    action: "Not Returned",
    dueDate: "25 Jun 2026",
  },
  {
    id: 4,
    title: "Operating Systems",
    user: "Diana Ray",
    initials: "DR",
    initialsBg: "bg-[#E1E3E4]",
    date: "26 Jun 2026",
    status: "Returned",
    action: "Returned",
    dueDate: "-",
  },
  {
    id: 2,
    title: "Design Patterns",
    user: "Bob Smith",
    initials: "BS",
    initialsBg: "bg-[#FCD34D]",
    date: "29 Jun 2026",
    status: "Pending",
    action: "Waitlisted",
    dueDate: "-",
  },
  {
    id: 3,
    title: "Database Systems",
    user: "Charlie Lee",
    initials: "CL",
    initialsBg: "bg-[#D0D7E7]",
    date: "27 Jun 2026",
    status: "Overdue",
    action: "Not Returned",
    dueDate: "25 Jun 2026",
  },
  {
    id: 4,
    title: "Operating Systems",
    user: "Diana Ray",
    initials: "DR",
    initialsBg: "bg-[#E1E3E4]",
    date: "26 Jun 2026",
    status: "Returned",
    action: "Returned",
    dueDate: "-",
  },
];

const statusStyles = {
  Issued: "bg-[#DCFCE7] text-[#15803D]",
  Pending: "bg-[#FEF9C3] text-[#A16207]",
  Overdue: "bg-[#FEE2E2] text-[#B91C1C]",
  Returned: "bg-[#E7E8E9] text-[#4D4635]",
};

export default function Track() {
  return (
    <div className="flex flex-col gap-8 p-8 mx-auto w-full">
      <h2 className="text-[20px] leading-7 font-semibold text-[#191C1D]">
        Recent Activity
      </h2>
      <div className="flex flex-col w-full bg-white border border-[#D0C6AE] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-[#D0C6AE]">
          <button className="w-9 h-[31px] flex items-center justify-center rounded-lg border border-[#D0C6AE] hover:bg-[#F3F4F5]">
            ⋯
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto overflow-y-auto ">
          <table className="w-full">
            <thead className="bg-[#F3F4F5] sticky top-0 z-10">
              <tr>
                {["Book", "User", "Date", "Status", "Due Date", ""].map(
                  (header, i) => (
                    <th
                      key={i}
                      className={`px-6 py-4 text-xs font-semibold uppercase tracking-[0.6px] text-[#4D4635] ${
                        i === 5 ? "text-right" : "text-left"
                      }`}
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {activityRows.map((row) => (
                <tr key={row.id} className="border-t border-[#D0C6AE] h-[81px]">
                  {/* Book */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-12 rounded bg-[#E7E8E9] shadow-sm" />
                      <span className="font-bold text-sm text-[#191C1D]">
                        {row.title}
                      </span>
                    </div>
                  </td>

                  {/* User */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${row.initialsBg}`}
                      >
                        {row.initials}
                      </span>
                      <span className="text-sm text-[#191C1D]">{row.user}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-5 text-sm text-[#4D4635]">
                    {row.date}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-[3px] rounded-full text-xs font-bold ${statusStyles[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-5 text-sm text-[#4D4635]">
                    {row.dueDate}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-right">
                    <button className="text-[#575E70] hover:text-[#191C1D]">
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex justify-between items-center px-6 py-6 bg-[#F3F4F5] border-t border-[#D0C6AE]">
          <span className="text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
            Showing 4 of 156 entries
          </span>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[#D0C6AE] rounded text-xs font-semibold">
              Prev
            </button>

            <button className="px-3 py-1 border border-[#D0C6AE] bg-white shadow-sm rounded text-xs font-bold">
              1
            </button>

            <button className="px-3 py-1 border border-[#D0C6AE] rounded text-xs font-semibold">
              2
            </button>

            <button className="px-3 py-1 border border-[#D0C6AE] rounded text-xs font-semibold">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
