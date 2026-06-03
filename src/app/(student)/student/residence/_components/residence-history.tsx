const history = [
  {
    date: "Jan 2024",
    title: "Assigned to A201",
    note: "Initial residence placement after account approval.",
  },
  {
    date: "Aug 2024",
    title: "Transferred to A304",
    note: "Moved into Block A, Floor 3 with the current room group.",
  },
  {
    date: "Present",
    title: "Living in A304",
    note: "Active resident with full room occupancy.",
  },
];

export function ResidenceHistory() {
  return (
    <div className="rounded-[1.75rem] border border-white/60 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
        Residence history
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
        Your stay timeline
      </h2>

      <div className="mt-7 space-y-0">
        {history.map((item, index) => (
          <div key={item.title} className="grid grid-cols-[5.5rem_1fr] gap-4">
            <p className="pt-1 font-mono text-xs uppercase tracking-[0.14em] text-stone-500">
              {item.date}
            </p>
            <div className="relative pb-7 pl-6">
              {index !== history.length - 1 && (
                <div className="absolute left-[0.3rem] top-3 h-full w-px bg-stone-300/80" />
              )}
              <div className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-[#8f6b3d] ring-4 ring-[#eee6da]" />
              <h3 className="font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
