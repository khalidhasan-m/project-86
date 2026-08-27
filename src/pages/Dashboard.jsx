import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AddRecordModal from "../components/AddRecordModal";
import { useAuth } from "../context/AuthContext";
import { addRecord, deleteRecord, getRecords } from "../utils/storage";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState(() => getRecords());
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: "/dashboard" } }} />;
  }

  const refreshRecords = () => setRecords(getRecords());

  const handleSave = (details) => {
    addRecord(details);
    refreshRecords();
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    if (window.confirm(`Delete the record for ${record.holderName}?`)) {
      deleteRecord(record.slug);
      refreshRecords();
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="border-b border-[var(--paper-line)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ink)] font-display text-base">V</div>
            <div>
              <p className="font-display text-lg leading-none">Verity</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">Admin console</p>
            </div>
          </div>
          <button type="button" onClick={handleSignOut} className="text-sm font-semibold text-[var(--slate)] transition hover:text-[var(--seal)] focus:outline-none focus:ring-2 focus:ring-[var(--seal)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]">Sign out</button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--seal)]">Verification registry</p>
            <h1 className="font-display text-5xl leading-none sm:text-6xl">Records</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--slate)]">Create and manage public records that can be verified from a unique link or QR code.</p>
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--ink)] px-5 py-3.5 text-sm font-semibold text-[var(--paper)] transition hover:bg-[#2d3a4b] focus:outline-none focus:ring-2 focus:ring-[var(--seal)]">
            <span className="text-lg leading-none">+</span> Add record
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-[var(--paper-line)] bg-white/45">
          {records.length === 0 ? (
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
                    <th className="px-6 py-4 font-semibold">Holder name</th>
                    <th className="px-6 py-4 font-semibold">Reference number</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Issue date</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-line)]">
                  {records.map((record) => (
                    <tr key={record.slug} className="transition hover:bg-white/70">
                      <td className="px-6 py-5 font-medium">{record.holderName}</td>
                      <td className="px-6 py-5 font-mono text-sm text-[var(--slate)]">{record.referenceNo}</td>
                      <td className="px-6 py-5 text-sm">{record.amount}</td>
                      <td className="px-6 py-5 text-sm text-[var(--slate)]">{formatDate(record.issueDate)}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-4 text-sm font-semibold">
                          <button type="button" onClick={() => window.open(`/record/${record.slug}`, "_blank", "noopener,noreferrer")} className="text-[var(--ink)] underline decoration-[var(--paper-line)] underline-offset-4 transition hover:text-[var(--seal)]">View</button>
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
        <p className="mt-5 text-xs text-[var(--slate)]">{records.length} {records.length === 1 ? "record" : "records"} in this browser</p>
      </section>

      {isModalOpen && <AddRecordModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
    </main>
  );
}
