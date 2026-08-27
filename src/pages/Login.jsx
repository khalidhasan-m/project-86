import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfcff] px-4 py-12 text-[#202b3d]">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full border border-[var(--paper-line)] opacity-70" />
      <div className="pointer-events-none absolute -bottom-36 -right-28 h-96 w-96 rounded-full border border-[var(--paper-line)] opacity-70" />
      <section className="relative w-full max-w-md">
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-[#e6e9ee] bg-gradient-to-r from-[#f2fff0] via-[#f7f9fb] to-[#fff2f5] px-5 py-4">
          <BrandMark className="h-14 w-16" />
          <div>
            <p className="text-xl font-bold leading-tight text-[#202b3d]">Solvency Certificate Verification</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#667085]">Administrator access</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6e9ee] bg-white p-7 shadow-[0_2px_9px_rgba(31,42,55,0.08)] sm:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#e8f8ef] px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] text-[#138a48]"><span className="h-2 w-2 rounded-full bg-[#0e9d4a]" /> Verification details</div>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-[#202b3d]">Welcome back.</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#667085]">Sign in to manage verified records and create QR links.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slate)]">Username</span>
              <input required value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} autoComplete="username" className="w-full rounded-xl border border-[#e6e9ee] bg-[#fbfcff] px-4 py-3 text-[#202b3d] outline-none transition focus:border-[#0b6db6] focus:ring-2 focus:ring-[#d9eaf7]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slate)]">Password</span>
              <input required type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="current-password" className="w-full rounded-xl border border-[#e6e9ee] bg-[#fbfcff] px-4 py-3 text-[#202b3d] outline-none transition focus:border-[#0b6db6] focus:ring-2 focus:ring-[#d9eaf7]" />
            </label>
            {error && <p className="text-sm leading-5 text-[var(--seal)]" role="alert">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-[#075b99] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#064b7d] focus:outline-none focus:ring-2 focus:ring-[#d9eaf7]">
              Sign in
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-[#667085]">Credentials are configured by the administrator.</p>
      </section>
    </main>
  );
}
