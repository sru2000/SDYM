import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiLock, FiLogIn, FiMail } from "react-icons/fi";
import BrandLogo from "../components/layout/BrandLogo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Login({ initialMode = "login" }) {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: "",
    email: "admin@krishimitra.ai",
    password: "admin123",
    role: "Operations Lead",
    region: "Andhra Pradesh and Telangana",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          region: form.region,
        });
      } else {
        await login(form);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#07110d] dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_30%)]" />
      <main className="relative grid min-h-screen place-items-center px-4 py-10">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-emerald-100 bg-white/88 shadow-2xl shadow-emerald-950/12 backdrop-blur-xl dark:border-emerald-900/50 dark:bg-slate-950/88 lg:grid-cols-[1fr_440px]">
          <div className="hidden min-h-[560px] flex-col justify-between bg-emerald-950 p-10 text-white lg:flex">
            <BrandLogo compact />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-200">
                Secure operations hub
              </p>
              <h1 className="mt-5 max-w-xl text-5xl font-black leading-tight tracking-tight">
                KrishiMitra AI
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-emerald-50/82">
                Access pest risk, regional recommendations, field activity, and AI-backed crop intelligence with your team account.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {["JWT secured", "SQLite users", "Live insights"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 font-semibold text-emerald-50"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 lg:py-12">
            <div className="mb-10 lg:hidden">
              <BrandLogo />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                {mode === "register" ? "Create account" : "Welcome back"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                {mode === "register" ? "Register your workspace access" : "Sign in to continue"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {mode === "register"
                  ? "Create a user profile that can be updated later in Settings."
                  : "Use a demo account or your registered credentials."}
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {mode === "register" && (
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Full name
                  </span>
                  <span className="mt-2 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-emerald-900/60 dark:bg-slate-900">
                    <input
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Enter your name"
                      required
                    />
                  </span>
                </label>
              )}

              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Email
                </span>
                <span className="mt-2 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-emerald-900/60 dark:bg-slate-900">
                  <FiMail className="text-emerald-700 dark:text-emerald-300" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="admin@krishimitra.ai"
                    required
                  />
                </span>
              </label>

              {mode === "register" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Role
                    </span>
                    <span className="mt-2 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-emerald-900/60 dark:bg-slate-900">
                      <input
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                        type="text"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        placeholder="Operations Lead"
                        required
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Region
                    </span>
                    <select
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      className="mt-2 h-12 w-full rounded-2xl border border-emerald-100 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-emerald-900/50 dark:bg-slate-900 dark:text-white"
                    >
                      <option>Andhra Pradesh and Telangana</option>
                      <option>Guntur cluster</option>
                      <option>Warangal cluster</option>
                      <option>Nellore cluster</option>
                    </select>
                  </label>
                </div>
              )}

              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Password
                </span>
                <span className="mt-2 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-emerald-900/60 dark:bg-slate-900">
                  <FiLock className="text-emerald-700 dark:text-emerald-300" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                </span>
              </label>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
                  <FiAlertCircle className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/24 hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <FiLogIn />
                {isSubmitting
                  ? mode === "register"
                    ? "Creating account..."
                    : "Signing in..."
                  : mode === "register"
                    ? "Create account"
                    : "Login"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode((current) => (current === "login" ? "register" : "login"));
                }}
                className="w-full text-center text-sm font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
              >
                {mode === "register"
                  ? "Already have an account? Login"
                  : "Need an account? Sign up"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
