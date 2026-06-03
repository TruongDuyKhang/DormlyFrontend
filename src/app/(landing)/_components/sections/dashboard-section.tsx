"use client";

const METRICS = [
  { label: "Students", value: "1,842", detail: "approved and active" },
  { label: "Occupancy", value: "94.3%", detail: "across all blocks" },
  { label: "Open tickets", value: "17", detail: "6 close to deadline" },
  { label: "Complaints", value: "8", detail: "3 anonymous" },
];

const AI_PROMPTS = [
  "What is the electricity and water fee this month?",
  "Create an urgent maintenance ticket for room C-418.",
  "Which rooms have repeated HVAC issues?",
];

export function DashboardSection() {
  return (
    <section
      data-scene="dashboard"
      id="dashboard-ai"
      className="cinematic-scene relative min-h-[108dvh] overflow-hidden bg-[#f9f4ec] text-stone-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(180,136,77,0.18),transparent_30%),radial-gradient(circle_at_78%_12%,rgba(255,255,255,0.85),transparent_28%),linear-gradient(180deg,#f9f4ec_0%,#eadcc8_100%)]" />

      <div className="relative z-10 mx-auto grid min-h-[108dvh] max-w-[1500px] items-center gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.72fr_1fr] lg:px-12">
        <div className="scene-copy max-w-xl">
          <p className="scene-eyebrow text-[11px] font-semibold uppercase tracking-[0.42em] text-stone-500">
            Dashboard + AI Showcase
          </p>
          <h2 className="scene-title mt-7 text-[clamp(2.7rem,5vw,6.2rem)] font-light leading-[0.94] tracking-tight">
            A command room with an assistant built in.
          </h2>
          <p className="scene-body mt-7 text-base leading-relaxed text-stone-600 lg:text-lg">
            Managers see rooms, student status, incidents, complaints,
            notifications, and exports. Admins monitor the full system and tune
            AI rules for FAQs, auto-assignment, ticket deadlines, and alerts.
          </p>
        </div>

        <div className="scene-console relative">
          <div className="console-shell overflow-hidden rounded-[1.9rem] border border-stone-950/10 bg-[#241d17] p-3 shadow-[0_40px_120px_-60px_rgba(38,28,19,0.8)]">
            <div className="rounded-[1.35rem] bg-[#fbf7ef] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-950/10 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">System overview</p>
                  <h3 className="mt-2 text-3xl font-light tracking-tight">Dormly Control Center</h3>
                </div>
                <span className="rounded-full bg-[#d8eadb] px-4 py-2 text-sm font-medium text-[#34573a]">AI online</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {METRICS.map((metric) => (
                  <div key={metric.label} className="metric-card rounded-[1.05rem] border border-stone-950/10 bg-white/70 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">{metric.label}</p>
                    <p className="mt-3 font-mono text-3xl tracking-tight text-stone-950">{metric.value}</p>
                    <p className="mt-1 text-sm text-stone-600">{metric.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
                <div className="chart-panel rounded-[1.25rem] border border-stone-950/10 bg-[#efe4d4] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-stone-800">Occupancy and service pressure</p>
                    <p className="font-mono text-xs text-stone-500">30 days</p>
                  </div>
                  <div className="mt-5 flex h-32 items-end gap-1.5">
                    {[54, 62, 59, 66, 74, 71, 78, 82, 76, 84, 89, 87, 91, 86, 93, 90, 88, 94].map((value, index) => (
                      <span
                        key={index}
                        className="chart-bar flex-1 rounded-t-full bg-stone-950/80"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="ai-panel rounded-[1.25rem] border border-stone-950/10 bg-white/75 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-stone-500">AI chatbot engine</p>
                  <div className="mt-4 space-y-3">
                    {AI_PROMPTS.map((prompt) => (
                      <div key={prompt} className="ai-prompt rounded-2xl bg-stone-950 px-4 py-3 text-sm leading-relaxed text-white">
                        {prompt}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">
                    Answers rules, creates tickets, and escalates overdue work
                    into the right manager flow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="scene-floating absolute -left-4 top-8 hidden max-w-[240px] rounded-[1.3rem] border border-stone-950/10 bg-white/80 p-4 shadow-[0_22px_70px_-46px_rgba(38,28,19,0.7)] backdrop-blur-xl lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-stone-500">System action</p>
            <p className="mt-2 text-lg font-light leading-snug">Ticket C-418 escalates in 42 minutes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
