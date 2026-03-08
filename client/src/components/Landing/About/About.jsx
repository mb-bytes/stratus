import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Zap, Users } from "lucide-react";
import { Button as MovingButton } from "../ui/moving-border";

const values = [
    {
        id: 0,
        icon: <Target size={18} className="text-white" />,
        label: "Purpose",
        title: "Built with purpose",
        headline: "Born from real frustration.",
        body: "Stratus was built because spreadsheets weren't cutting it — missed follow-ups, lost applications, and zero clarity. We built the tool we wished existed.",
    },
    {
        id: 1,
        icon: <Zap size={18} className="text-white" />,
        label: "Speed",
        title: "Speed matters",
        headline: "Less friction, more focus.",
        body: "Job searching is exhausting enough. Stratus removes the busywork so you can spend your energy on what actually moves the needle — preparing and connecting.",
    },
    {
        id: 2,
        icon: <Users size={18} className="text-white" />,
        label: "Everyone",
        title: "Made for everyone",
        headline: "Simple by default, powerful when needed.",
        body: "Whether you're a fresh graduate or a seasoned professional, Stratus adapts to how you work. No learning curve, no bloat — just clarity.",
    },
];

const defaultRight = {
    headline: "We're on your side of the table.",
    body: "Hover on any card to learn more about what drives us.",
};

function About() {
    const [active, setActive] = useState(null);
    const right = active !== null ? values[active] : defaultRight;

    return (
        <section id="about" className="relative z-10 py-24 px-6">
            <div className="max-w-6xl mx-auto">

                {/* heading */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-sm font-medium tracking-widest uppercase text-neutral-500 mb-3">
                        About
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1]">
                        We're on your
                        <br />
                        <span className="font-bold">side of the table.</span>
                    </h2>
                </motion.div>

                {/* bento + description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* ── LEFT: outer bento frame ── */}
                    <motion.div
                        className="bg-white border border-neutral-200 rounded-3xl p-4 shadow-sm"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="grid grid-cols-2 gap-3">

                            {/* Card 1 — top-left */}
                            <motion.div
                                className={`col-span-1 rounded-2xl border p-5 cursor-pointer transition-colors duration-200 ${active === 0 ? "border-neutral-400 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                                onHoverStart={() => setActive(0)}
                                onHoverEnd={() => setActive(null)}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.18 }}
                            >
                                <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center mb-4">
                                    {values[0].icon}
                                </div>
                                <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
                                    {values[0].label}
                                </p>
                                <h3 className="text-sm font-semibold text-black leading-snug mb-4">
                                    {values[0].title}
                                </h3>
                                {/* stat mock */}
                                <div className="space-y-2">
                                    {[["Applications", "94%"], ["Follow-ups", "87%"]].map(([label, val]) => (
                                        <div key={label}>
                                            <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                                <span>{label}</span><span className="font-semibold text-black">{val}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-neutral-100 rounded-full">
                                                <div className="h-1.5 bg-black rounded-full" style={{ width: val }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Card 2 — top-right */}
                            <motion.div
                                className={`col-span-1 rounded-2xl border p-5 cursor-pointer transition-colors duration-200 ${active === 1 ? "border-neutral-400 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                                onHoverStart={() => setActive(1)}
                                onHoverEnd={() => setActive(null)}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.18 }}
                            >
                                <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center mb-4">
                                    {values[1].icon}
                                </div>
                                <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
                                    {values[1].label}
                                </p>
                                <h3 className="text-sm font-semibold text-black leading-snug mb-4">
                                    {values[1].title}
                                </h3>
                                {/* speed steps mock */}
                                <div className="space-y-2">
                                    {["Add application", "Track stage", "Get hired"].map((step, i) => (
                                        <div key={step} className="flex items-center gap-2.5">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${i === 0 ? "bg-black text-white" : "bg-neutral-100 text-neutral-400"}`}>
                                                {i + 1}
                                            </div>
                                            <span className={`text-[11px] ${i === 0 ? "text-black font-semibold" : "text-neutral-400"}`}>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Card 3 — bottom full width */}
                            <motion.div
                                className={`col-span-2 rounded-2xl border p-5 cursor-pointer transition-colors duration-200 ${active === 2 ? "border-neutral-400 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}
                                onHoverStart={() => setActive(2)}
                                onHoverEnd={() => setActive(null)}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.18 }}
                            >
                                <div className="flex items-start gap-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center mb-4">
                                            {values[2].icon}
                                        </div>
                                        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
                                            {values[2].label}
                                        </p>
                                        <h3 className="text-sm font-semibold text-black leading-snug">
                                            {values[2].title}
                                        </h3>
                                    </div>
                                    {/* avatar mock */}
                                    <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { initials: "JG", role: "Graduate" },
                                                { initials: "SR", role: "Engineer" },
                                                { initials: "AM", role: "Designer" },
                                                { initials: "TC", role: "Manager" },
                                            ].map(({ initials, role }) => (
                                                <div key={initials} className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 shadow-sm">
                                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                                                        {initials}
                                                    </div>
                                                    <span className="text-[10px] text-neutral-500">{role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

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
                                        {values[active].icon}
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

                {/* ── CTA strip ── */}
                <motion.div
                    className="mt-8 bg-black rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-1">
                            Ready to take control?
                        </h3>
                    </div>
                    <MovingButton
                        as="a"
                        href="/signup"
                        borderRadius="9999px"
                        duration={2500}
                        className="px-7 py-3 text-sm font-semibold bg-white text-black border-neutral-200 flex-shrink-0"
                        borderClassName="h-20 w-20 opacity-90 bg-[radial-gradient(#000000_40%,transparent_60%)]"
                    >
                        Get started free
                    </MovingButton>
                </motion.div>

            </div>
        </section>
    );
}

export default About;

