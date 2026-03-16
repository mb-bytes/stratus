import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Kanban, BarChart3, NotebookPen } from "lucide-react";

const features = [
  {
    id: 0,
    icon: <NotebookPen size={18} className="text-white" />,
    label: "Notes",
    title: "Rich-text Notes",
    headline: "Capture every detail.",
    body: "Write rich-text notes per job or as standalone thoughts — format with headings, colours, and highlights, all saved to your account.",
  },
  {
    id: 1,
    icon: <BarChart3 size={18} className="text-white" />,
    label: "Analytics",
    title: "Smart Analytics",
    headline: "See where you stand.",
    body: "Understand your conversion rates at every stage — from applications to offers — and identify where you're losing momentum.",
  },
  {
    id: 2,
    icon: <Kanban size={18} className="text-white" />,
    label: "Kanban",
    title: "Visual Kanban Board",
    headline: "Never lose track again.",
    body: "Drag and drop applications through stages — Applied, Interview, Offer — and always know where every opportunity stands.",
  },
];

const defaultRight = {
  headline: "Built for the modern job search.",
  body: "Stratus gives you the tools to stay organised, move fast, and land the roles you actually want.",
};

export function BentoGridSecondDemo() {
  const [active, setActive] = useState(null);

  const right = active !== null ? features[active] : defaultRight;

  return (
    <section id="features" className="relative z-10 mt-3 sm:mt-6 md:mt-32 pb-12 md:pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Heading ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-neutral-500 mb-3">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1]">
            Three tools,
            <br />
            <span className="font-bold">one dashboard.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── LEFT: outer bento frame ── */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">

              {/* Feature 1 — top-left, shorter */}
              <motion.div
                className={`relative col-span-1 rounded-2xl border p-5 cursor-pointer transition-colors duration-200 ${
                  active === 0
                    ? "border-neutral-400 bg-neutral-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
                onHoverStart={() => setActive(0)}
                onHoverEnd={() => setActive(null)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
              >
                <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center mb-4">
                  {features[0].icon}
                </div>
                <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
                  {features[0].label}
                </p>
                <h3 className="text-sm font-semibold text-black leading-snug">
                  {features[0].title}
                </h3>
                {/* note card mock */}
                <div className="mt-4 space-y-2">
                  {[
                    { title: "Google – SWE", preview: "Ask about team structure and growth...", color: "#eff6ff" },
                    { title: "Prep notes", preview: "System design: focus on scalability", color: "#f0fdf4" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-neutral-200 px-3 py-2"
                      style={{ backgroundColor: n.color }}
                    >
                      <p className="text-[10px] font-semibold text-neutral-700 truncate">{n.title}</p>
                      <p className="text-[9px] text-neutral-400 truncate mt-0.5">{n.preview}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Feature 2 — top-right, taller */}
              <motion.div
                className={`relative col-span-1 rounded-2xl border p-5 cursor-pointer transition-colors duration-200 ${
                  active === 1
                    ? "border-neutral-400 bg-neutral-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
                onHoverStart={() => setActive(1)}
                onHoverEnd={() => setActive(null)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
              >
                <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center mb-4">
                  {features[1].icon}
                </div>
                <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
                  {features[1].label}
                </p>
                <h3 className="text-sm font-semibold text-black leading-snug">
                  {features[1].title}
                </h3>
                {/* bar chart mock */}
                <div className="mt-4 bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                  <div className="flex items-end justify-between gap-1.5 h-14">
                    {[35, 58, 80, 50, 68, 42].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{ height: `${h}%`, backgroundColor: i === 2 ? "#000" : "#e5e7eb" }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5 text-[9px] text-neutral-400 font-mono">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  </div>
                </div>
                {/* extra stat to make this card taller */}
                <div className="mt-3 flex items-baseline gap-1.5 bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2">
                  <span className="text-lg font-bold text-black">68%</span>
                  <span className="text-[10px] text-neutral-400">response rate</span>
                </div>
              </motion.div>

              {/* Feature 3 — bottom, full width */}
              <motion.div
                className={`relative col-span-2 rounded-2xl border p-5 cursor-pointer transition-colors duration-200 ${
                  active === 2
                    ? "border-neutral-400 bg-neutral-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
                onHoverStart={() => setActive(2)}
                onHoverEnd={() => setActive(null)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center mb-4">
                      {features[2].icon}
                    </div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
                      {features[2].label}
                    </p>
                    <h3 className="text-sm font-semibold text-black leading-snug">
                      {features[2].title}
                    </h3>
                  </div>
                  {/* mini kanban preview */}
                  <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl p-3 flex gap-2 overflow-hidden min-w-0">
                    {[
                      { label: "Applied", cards: ["Google", "Stripe"] },
                      { label: "Interview", cards: ["Airbnb"] },
                      { label: "Offer", cards: [] },
                    ].map((col) => (
                      <div key={col.label} className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 truncate">
                          {col.label}
                        </p>
                        <div className="space-y-1">
                          {col.cards.map((c) => (
                            <div key={c} className="bg-white border border-neutral-200 rounded-lg px-2 py-1.5 shadow-sm">
                              <div className="h-1.5 w-10 bg-neutral-800 rounded mb-1" />
                              <div className="h-1.5 w-7 bg-neutral-200 rounded" />
                            </div>
                          ))}
                          {col.cards.length === 0 && (
                            <div className="border border-dashed border-neutral-200 rounded-lg h-7" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* ── RIGHT: large description ── */}
          <div className="lg:pl-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active ?? "default"}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {active !== null && (
                  <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center mb-6">
                    {features[active].icon}
                  </div>
                )}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-black leading-[1.05] mb-5">
                  {right.headline}
                </h2>
                <p className="text-neutral-500 text-lg leading-relaxed max-w-sm">
                  {right.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
