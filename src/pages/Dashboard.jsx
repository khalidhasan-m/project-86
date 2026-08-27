import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AddRecordModal from "../components/AddRecordModal";
import BrandMark from "../components/BrandMark";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

function formatGeneratedDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()].map((part) => String(part).padStart(2, "0")).join(":");
  return `${day}-${month}-${year} ${time}`;
}

export default function Dashboard() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .getRecords()
      .then(setRecords)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoadingRecords(false));
  }, [isAuthenticated]);

  if (isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] text-sm text-[var(--slate)]">Checking session…</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: "/dashboard" } }} />;
  }

  const refreshRecords = async () => {
    const nextRecords = await api.getRecords();
    setRecords(nextRecords);
  };

  const handleSave = async (details) => {
    try {
      await api.addRecord(details);
      await refreshRecords();
      setIsModalOpen(false);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (record) => {
    if (window.confirm(`Delete the record for ${record.holderName}?`)) {
      try {
        await api.deleteRecord(record.slug);
        await refreshRecords();
        setError("");
      } catch (requestError) {
        setError(requestError.message);
      }
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#202b3d]">
      <header className="border-b border-[#edf0f4] bg-gradient-to-r from-[#f2fff0] via-[#f7f9fb] to-[#fff2f5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-12" />
            <div>
              <p className="text-lg font-bold leading-none text-[#202b3d]">Solvency Certificate Verification</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#667085]">Admin console</p>
            </div>
          </div>
          <button type="button" onClick={handleSignOut} className="text-sm font-semibold text-[#075b99] transition hover:text-[#d82338] focus:outline-none focus:ring-2 focus:ring-[#0b6db6] focus:ring-offset-2 focus:ring-offset-[#fbfcff]">Sign out</button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8f8ef] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#138a48]"><span className="h-2 w-2 rounded-full bg-[#0e9d4a]" /> Verification details</div>
            <h1 className="text-5xl font-bold leading-none tracking-[-0.05em] text-[#202b3d] sm:text-6xl">Records</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#667085]">Create and manage the dynamic verification records that power each QR link.</p>
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075b99] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#064b7d] focus:outline-none focus:ring-2 focus:ring-[#d9eaf7]">
            <span className="text-lg leading-none">+</span> Add record
          </button>
        </div>

        {error && <p className="mb-4 rounded-md border border-[var(--seal-soft)] bg-[var(--seal-soft)] px-4 py-3 text-sm text-[var(--seal)]" role="alert">{error}</p>}

        <div className="overflow-hidden rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_2px_9px_rgba(31,42,55,0.08)]">
          {isLoadingRecords ? (
            <div className="px-6 py-20 text-center text-sm text-[var(--slate)]">Loading records…</div>
          ) : records.length === 0 ? (
            <div className="px-6 py-20 text-center sm:py-28">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--paper-line)] font-display text-2xl text-[var(--seal)]">V</div>
              <h2 className="font-display text-2xl">No records yet.</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">Add your first one to begin building the registry.</p>
              <button type="button" onClick={() => setIsModalOpen(true)} className="mt-6 text-sm font-semibold text-[var(--seal)] underline decoration-[var(--seal-soft)] underline-offset-4 transition hover:text-[var(--ink)]">Add your first record</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--paper-line)] text-xs uppercase tracking-[0.13em] text-[var(--slate)]">
                    <th className="px-6 py-4 font-semibold">Account name</th>
                    <th className="px-6 py-4 font-semibold">Account no</th>
                    <th className="px-6 py-4 font-semibold">Balance</th>
                    <th className="px-6 py-4 font-semibold">Generation date</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f4]">
                  {records.map((record) => (
                    <tr key={record.slug} className="transition hover:bg-[#f7fbff]">
                      <td className="px-6 py-5 font-medium">{record.holderName}</td>
                      <td className="px-6 py-5 font-mono text-sm text-[var(--slate)]">{record.referenceNo}</td>
                      <td className="px-6 py-5 text-sm">{record.amount}</td>
                      <td className="px-6 py-5 text-sm text-[var(--slate)]">{formatGeneratedDate(record.issueDate)}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-4 text-sm font-semibold">
                          <button type="button" onClick={() => window.open(`/record/${record.slug}`, "_blank", "noopener,noreferrer")} className="text-[var(--ink)] underline decoration-[var(--paper-line)] underline-offset-4 transition hover:text-[var(--seal)]">View</button>
                          <button type="button" onClick={() => window.open(`/record/${record.slug}/qr`, "_blank", "noopener,noreferrer")} className="text-[var(--ink)] underline decoration-[var(--paper-line)] underline-offset-4 transition hover:text-[var(--seal)]">QR</button>
                          <button type="button" onClick={() => handleDelete(record)} className="text-[var(--seal)] transition hover:text-[var(--ink)]">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="mt-5 text-xs text-[#667085]">{records.length} {records.length === 1 ? "record" : "records"} stored on the server</p>
      </section>

      {isModalOpen && <AddRecordModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
    </main>
  );
}
