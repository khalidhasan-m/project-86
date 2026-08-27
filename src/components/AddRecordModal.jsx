import { useState } from "react";

const initialForm = {
  holderName: "",
  referenceNo: "",
  amount: "",
  issueDate: "",
};

export default function AddRecordModal({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.values(form).some((value) => !value.trim())) {
      setError("Complete every field before saving the record.");
      return;
    }
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,42,55,0.46)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-record-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-[var(--paper-line)] bg-[var(--paper)] p-6 shadow-[0_24px_70px_rgba(31,42,55,0.2)] sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--seal)]">New entry</p>
            <h2 id="add-record-title" className="font-display text-3xl text-[var(--ink)]">Add a record</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-xl leading-none text-[var(--slate)] transition hover:bg-[var(--seal-soft)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--seal)]" aria-label="Close dialog">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Account name" name="holderName" value={form.holderName} onChange={updateField} placeholder="e.g. MD ABDUR RAZZAK" />
          <Field label="Account no" name="referenceNo" value={form.referenceNo} onChange={updateField} placeholder="e.g. 2871570580747" mono />
          <Field label="Report date balance" name="amount" value={form.amount} onChange={updateField} placeholder="e.g. 1,07,067.00" />
          <Field label="Report generation date" name="issueDate" type="datetime-local" value={form.issueDate} onChange={updateField} />

          {error && <p className="text-sm text-[var(--seal)]" role="alert">{error}</p>}

          <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-md border border-[var(--paper-line)] px-5 py-3 text-sm font-semibold text-[var(--slate)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--seal)]">Cancel</button>
            <button type="submit" className="rounded-md bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--paper)] transition hover:bg-[#2d3a4b] focus:outline-none focus:ring-2 focus:ring-[var(--seal)]">Save record</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder, mono = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slate)]">{label}</span>
      <input required type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full rounded-md border border-[var(--paper-line)] bg-white/60 px-4 py-3 text-[var(--ink)] outline-none transition placeholder:text-[var(--slate)]/55 focus:border-[var(--seal)] focus:ring-2 focus:ring-[var(--seal-soft)] ${mono ? "font-mono" : ""}`} />
    </label>
  );
}
