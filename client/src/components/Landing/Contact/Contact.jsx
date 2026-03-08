import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, User } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
};

function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <section id="contact" className="relative z-10 py-24 px-6">
            <div className="max-w-6xl mx-auto">

                {/* heading */}
                <motion.div
                    className="mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeUp}
                >
                    <p className="text-sm font-medium tracking-widest uppercase text-neutral-500 mb-3">
                        Contact
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1] max-w-xl">
                        Got a question?
                        <br />
                        <span className="font-bold">Let's talk.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* form */}
                    <motion.div
                        className="lg:col-span-3 bg-white border border-neutral-200 rounded-3xl p-8 hover:border-neutral-400 transition-colors duration-300"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        custom={1}
                        variants={fadeUp}
                    >
                        {sent ? (
                            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-5">
                                    <MessageSquare size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-black mb-2">Message sent!</h3>
                                <p className="text-neutral-500 text-sm">We'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="contact_name" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            type="text"
                                            id="contact_name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="contact_email" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            type="email"
                                            id="contact_email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="contact_message" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                        Message
                                    </label>
                                    <textarea
                                        id="contact_message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="What's on your mind?"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors duration-200 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-1 w-full py-3.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200 shadow-lg shadow-black/20"
                                >
                                    Send message →
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* side info */}
                    <motion.div
                        className="lg:col-span-2 flex flex-col gap-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        custom={2}
                        variants={fadeUp}
                    >
                        {/* email card */}
                        <div className="bg-black rounded-3xl p-8 flex flex-col justify-between flex-1">
                            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                                <Mail size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                                    Email directly
                                </p>
                                <p className="text-white font-semibold text-lg tracking-tight">
                                    atique.sh2@gmail.com
                                </p>
                                <a
                                    href="mailto:atique.sh2@gmail.com"
                                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-100 transition-colors duration-200"
                                >
                                    <Mail size={12} />
                                    Open in mail
                                </a>
                            </div>
                        </div>

                        {/* response time card */}
                        <div className="bg-white border border-neutral-200 rounded-3xl p-8 hover:border-neutral-400 transition-colors duration-300">
                            <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center mb-5">
                                <MessageSquare size={20} className="text-white" />
                            </div>
                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                                Response time
                            </p>
                            <p className="text-black font-bold text-3xl tracking-tighter">
                                &lt; 24h
                            </p>
                            {/* <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                                Feature requests, bug reports, or just to say hi — we're all ears.
                            </p> */}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

export default Contact;
