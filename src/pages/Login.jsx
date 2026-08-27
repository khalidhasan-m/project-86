import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] text-sm text-[var(--slate)]">Checking session…</main>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (await login(username, password)) {
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
      return;
    }
    setError("Those credentials do not match the configured administrator account.");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--paper)] px-4 py-12 text-[var(--ink)]">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full border border-[var(--paper-line)] opacity-70" />
      <div className="pointer-events-none absolute -bottom-36 -right-28 h-96 w-96 rounded-full border border-[var(--paper-line)] opacity-70" />
      <section className="relative w-full max-w-md">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ink)] font-display text-lg">V</div>
          <div>
            <p className="font-display text-xl leading-none">Verity</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">Record verification</p>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--paper-line)] bg-white/45 p-7 shadow-[0_18px_50px_rgba(31,42,55,0.06)] sm:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--seal)]">Administrator access</p>
          <h1 className="font-display text-4xl leading-tight">Welcome back.</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--slate)]">Sign in to manage verified records and share secure public links.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slate)]">Username</span>
              <input required value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} autoComplete="username" className="w-full rounded-md border border-[var(--paper-line)] bg-white/60 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--seal)] focus:ring-2 focus:ring-[var(--seal-soft)]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slate)]">Password</span>
              <input required type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="current-password" className="w-full rounded-md border border-[var(--paper-line)] bg-white/60 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--seal)] focus:ring-2 focus:ring-[var(--seal-soft)]" />
            </label>
            {error && <p className="text-sm leading-5 text-[var(--seal)]" role="alert">{error}</p>}
            <button type="submit" className="w-full rounded-md bg-[var(--ink)] px-5 py-3.5 text-sm font-semibold text-[var(--paper)] transition hover:bg-[#2d3a4b] focus:outline-none focus:ring-2 focus:ring-[var(--seal)]">
              Sign in
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-[var(--slate)]">Credentials are configured by the administrator.</p>
      </section>
    </main>
  );
}
