import { useState, useEffect, useRef } from "react";
import { cn } from "../../../libs/utils";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import onlyLogo from "/assets/onlyLogo.png";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconCheck,
} from "@tabler/icons-react";
import { Label } from "../Signup/Label";
import { Input } from "../Signup/Input";
import { useAuth } from "../../../contexts/AuthContext";
import { sileo } from "sileo";

const features = [
  "Track every application in one place",
  "Monitor interview stages & follow-ups",
  "Built for serious job seekers",
];

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toastId = useRef(null);

  useEffect(() => {
    if (searchParams.get("error") === "auth_failed") {
      setError("Google sign-in failed. Please try again.");
    }
  }, []);

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
    const result = await login(form.username, form.password);
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
        title: "Error Occured",
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
      {/* Left Panel */}
      <div className="hidden lg:flex min-h-dvh w-1/2 relative bg-black flex-col items-center justify-center px-16">
        {/* Indigo top glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
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

          <div className="space-y-3 cursor-default">
            <h2 className="text-4xl font-semibold text-white leading-tight text-balance">
              Take control of your{" "}
              <span className="text-neutral-200">Job Applications</span>
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed text-pretty">
              Track every application, interview, and offer in one place — so
              nothing slips through the cracks.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-3 cursor-default">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-sm text-neutral-300"
              >
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

      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-[#f8fafc]">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-md px-6 py-12">
          <div className="lg:hidden mb-8">
            <Link to="/" className="text-black text-2xl font-semibold tracking-tight">
              Stratus
            </Link>
          </div>

          <div className="shadow-[0_2px_40px_-4px_rgba(0,0,0,0.10)] bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-black font-medium underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <LabelInputContainer>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </LabelInputContainer>

              <button
                className="group/btn cursor-pointer relative mt-1 block h-11 w-full rounded-lg bg-black font-medium text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in →"
                )}
                <BottomGradient />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs text-neutral-400 uppercase tracking-wide">
                or
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="group/btn relative flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                type="button"
                onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL || ""}/api/auth/google`; }}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-600" />
                Continue with Google
                <BottomGradient />
              </button>
              <button
                className="group/btn relative flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                type="button"
                onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL || ""}/api/auth/github`; }}
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

export default Login;
