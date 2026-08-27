import { useState } from "react";

const initialForm = {
  referenceCode: "",
  holderName: "",
  referenceNo: "",
  branch: "",
  branchCode: "",
  accountType: "",
  currency: "BDT",
  openingDate: "",
  swiftCode: "",
  routingNo: "",
  amount: "",
  balanceUsd: "",
  issueDate: "",
};

const fields = [
  { label: "Reference code", name: "referenceCode", placeholder: "Enter the reference code" },
  { label: "Account holder", name: "holderName", placeholder: "Enter the account holder name" },
  { label: "Account number", name: "referenceNo", placeholder: "Enter the account number", mono: true },
  { label: "Branch", name: "branch", placeholder: "Enter the branch name" },
  { label: "Branch code", name: "branchCode", placeholder: "Enter the branch code" },
  { label: "Type of account", name: "accountType", placeholder: "Enter the account type" },
  { label: "Currency", name: "currency", placeholder: "Enter the currency" },
  { label: "Date of opening", name: "openingDate", type: "date" },
  { label: "Swift code", name: "swiftCode", placeholder: "Enter the SWIFT code", mono: true },
  { label: "Routing no", name: "routingNo", placeholder: "Enter the routing number", mono: true },
  { label: "Balance in BDT", name: "amount", placeholder: "Enter the balance in BDT" },
  { label: "Balance in USD", name: "balanceUsd", placeholder: "Enter the balance in USD" },
  { label: "Certificate date and time", name: "issueDate", type: "datetime-local" },
];

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
      setError("Complete every field before saving the certificate.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(31,42,55,0.46)] p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-record-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="my-4 w-full max-w-3xl rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_24px_70px_rgba(31,42,55,0.2)] sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d82338]">New certificate</p>
            <h2 id="add-record-title" className="text-3xl font-bold tracking-[-0.04em] text-[#202b3d]">Add certificate data</h2>
            <p className="mt-2 text-sm text-[#667085]">These values appear in the printed QR certificate and public verification page.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-xl leading-none text-[#667085] transition hover:bg-[#e8f8ef] hover:text-[#202b3d] focus:outline-none focus:ring-2 focus:ring-[#0b6db6]" aria-label="Close dialog">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => <Field key={field.name} {...field} value={form[field.name]} onChange={updateField} />)}
          </div>

          {error && <p className="text-sm text-[#d82338]" role="alert">{error}</p>}

          <div className="flex flex-col-reverse gap-3 border-t border-[#edf0f4] pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-[#e6e9ee] px-5 py-3 text-sm font-semibold text-[#667085] transition hover:border-[#202b3d] hover:text-[#202b3d] focus:outline-none focus:ring-2 focus:ring-[#0b6db6]">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#075b99] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064b7d] focus:outline-none focus:ring-2 focus:ring-[#d9eaf7]">Save certificate</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder, mono = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-[#667085]">{label}</span>
      <input required type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full rounded-xl border border-[#e6e9ee] bg-[#fbfcff] px-4 py-3 text-[#202b3d] outline-none transition placeholder:text-[#667085]/55 focus:border-[#0b6db6] focus:ring-2 focus:ring-[#d9eaf7] ${mono ? "font-mono" : ""}`} />
    </label>
  );
}
