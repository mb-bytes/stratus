"use client";
import { useState, useEffect, useRef } from "react";
import { Label } from "./Label";
import { Input } from "./Input";
import { cn } from "../../../libs/utils";
import { IconBrandGithub, IconBrandGoogle, IconCheck } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { sileo } from "sileo";
import CircularProgress from '@mui/material/CircularProgress';
import onlyLogo from "../../../../assets/onlyLogo.png";

const features = [
  "Track every application in one place",
  "Monitor interview stages & follow-ups",
  "Built for serious job seekers",
];

export function SignupFormDemo() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstname: "", lastname: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toastId = useRef(null);

  const handleChange = (e) => {
    if (toastId.current) {
      sileo.dismiss(toastId.current);
      toastId.current = null;
      setError("");
    }
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const name = `${form.firstname.trim()} ${form.lastname.trim()}`.trim();
    const result = await signup(name, form.username, form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate("/jobs");
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    if (error) {
      toastId.current = sileo.error({
        title: "Signup Failed",
        description: error,
        fill: "black",
        styles: {
          title: "text-white text-lg!",
          description: "text-white/75 text-md text-center!",
        },
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen w-full flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex min-h-dvh w-1/2 relative bg-black flex-col items-center justify-center px-16">
        {/* Indigo top glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-10 max-w-sm w-full">
          {/* Logo + wordmark */}
          <Link to="/">
          <div className="flex items-center gap-3">
            <img src={onlyLogo} alt="Stratus logo" className="w-9 h-auto" />
            <span className="text-white text-xl font-semibold">stratus</span>
          </div>
          </Link>

          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-4xl font-semibold text-white leading-tight text-balance">
              Take control of your{" "}
              <span className="text-neutral-200">Job Applications</span>
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed text-pretty">
              Track every application, interview, and offer in one place — so nothing slips through the cracks.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-neutral-300">
                <span className="flex items-center justify-center size-5 rounded-full bg-white/10 shrink-0">
                  <IconCheck className="size-3 text-white" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center relative bg-[#f8fafc]"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-md px-6 py-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="text-black text-2xl font-semibold tracking-tight">Stratus</span>
          </div>

          <div className="shadow-[0_2px_40px_-4px_rgba(0,0,0,0.10)] bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-medium underline underline-offset-4">
                Sign in
              </Link>
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-3">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" placeholder="John" type="text" value={form.firstname} onChange={handleChange} required />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" placeholder="Doe" type="text" value={form.lastname} onChange={handleChange} required />
                </LabelInputContainer>
              </div>
              <LabelInputContainer>
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe" type="text" value={form.username} onChange={handleChange} required />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" placeholder="john@example.com" type="email" value={form.email} onChange={handleChange} />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" value={form.password} onChange={handleChange} required />
                {form.password && (
                  <ul className="mt-1 space-y-1 text-xs">
                    {[
                      { label: "At least one lowercase letter", test: /[a-z]/ },
                      { label: "At least one uppercase letter", test: /[A-Z]/ },
                      { label: "At least one number",           test: /\d/ },
                      { label: "At least one special character (@$!%*?&)", test: /[@$!%*?&]/ },
                    ].map(({ label, test }) => {
                      const passed = test.test(form.password);
                      return (
                        <li key={label} style={{ color: passed ? "#16a34a" : "#a3a3a3" }} className="flex items-center gap-1.5">
                          <span>{passed ? "✓" : "○"}</span>
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </LabelInputContainer>

              <button
                className="group/btn cursor-pointer relative mt-2 flex items-center justify-center h-11 w-full rounded-lg bg-black font-medium text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress size={16} thickness={5} sx={{ color: "white" }} />
                    Creating account…
                  </span>
                ) : (
                  "Create account →"
                )}
                <BottomGradient />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs text-neutral-400 uppercase tracking-wide">or</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="group/btn relative flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                type="button"
                onClick={() => { window.location.href = "/api/auth/google"; }}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-600" />
                Continue with Google
                <BottomGradient />
              </button>
              <button
                className="group/btn relative flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                type="button"
                onClick={() => { window.location.href = "/api/auth/github"; }}
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-600" />
                Continue with GitHub
                <BottomGradient />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

export default SignupFormDemo;
