import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { api } from "../utils/api";

export default function RecordView() {
  const { slug } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getRecord(slug)
      .then((nextRecord) => {
        if (!cancelled) setRecord(nextRecord);
      })
      .catch(() => {
        if (!cancelled) setRecord(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fbfcff] text-sm text-[#667085]">Loading record…</main>;
  }

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfcff] px-5 text-[#202b3d]">
        <section className="w-full max-w-md rounded-2xl border border-[#e6e9ee] bg-white px-6 py-14 text-center shadow-[0_2px_9px_rgba(31,42,55,0.08)] sm:px-10">
          <BrandMark />
          <h1 className="mt-7 text-3xl font-bold">Record not found</h1>
          <p className="mt-3 text-sm leading-6 text-[#667085]">The verification link may be incorrect or the record may no longer be available.</p>
          <Link to="/login" className="mt-7 inline-block text-sm font-semibold text-[#075b99] underline underline-offset-4">Return to sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfcff] text-[#1f2937]">
      <header className="border-b border-[#edf0f4] bg-gradient-to-r from-[#f2fff0] via-[#f7f9fb] to-[#fff2f5]">
        <div className="mx-auto flex max-w-[1100px] items-center gap-4 px-6 py-4 sm:px-8 sm:py-5">
          <BrandMark />
          <h1 className="text-[20px] font-bold leading-tight tracking-[-0.025em] text-[#202b3d] sm:text-2xl">Solvency Certificate Verification</h1>
        </div>
      </header>

      <section className="mx-auto max-w-[1100px] px-6 pb-16 pt-8 sm:px-8 sm:pt-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f8ef] px-4 py-2 text-sm font-bold uppercase tracking-[0.03em] text-[#138a48]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0e9d4a]" />
            Verification details
          </div>
          <p className="mx-auto mt-5 max-w-3xl text-[18px] leading-[1.45] text-[#667085] sm:text-2xl sm:leading-9">
            The following information was retrieved from the scanned QR
            <br className="hidden sm:block" /> Code and verified.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <VerificationCard label="Account No" value={record.referenceNo} tone="blue" />
          <VerificationCard label="Account Name" value={record.holderName} tone="red" />
          <VerificationCard label="Report Date Balance" value={record.amount} tone="green" />
          <VerificationCard label="Report Generation Date" value={formatGeneratedDate(record.issueDate)} tone="blue" />
        </div>
      </section>
    </main>
  );
}

function VerificationCard({ label, value, tone }) {
  const toneStyles = {
    blue: { border: "#0b6db6", text: "#075b99" },
    red: { border: "#e51f38", text: "#d82338" },
    green: { border: "#0b9a4a", text: "#0a8b43" },
  }[tone];

  return (
    <article className="min-h-[102px] rounded-[20px] border border-[#e6e9ee] bg-white px-6 py-5 shadow-[0_2px_9px_rgba(31,42,55,0.08)] sm:min-h-[118px] sm:px-8 sm:py-6" style={{ borderLeft: `6px solid ${toneStyles.border}` }}>
      <h2 className="text-[18px] font-bold sm:text-xl" style={{ color: toneStyles.text }}>{label}</h2>
      <p className="mt-4 break-words text-[22px] font-medium leading-tight text-[#202b3d] sm:text-2xl">{value || "—"}</p>
    </article>
  );
}

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
