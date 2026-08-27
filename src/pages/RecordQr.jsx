import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import BrandMark from "../components/BrandMark";
import { api } from "../utils/api";

export default function RecordQr() {
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
    return <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] text-sm text-[var(--slate)]">Loading QR code…</main>;
  }

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-5 text-[var(--ink)]">
        <section className="w-full max-w-md rounded-lg border border-[var(--paper-line)] bg-white/45 px-6 py-14 text-center">
          <h1 className="font-display text-4xl">Record not found</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--slate)]">This QR code is not linked to an available verification record.</p>
          <Link to="/dashboard" className="mt-7 inline-block text-sm font-semibold text-[var(--seal)] underline underline-offset-4">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, "");
  const verificationUrl = `${publicAppUrl}/record/${record.slug}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfcff] px-5 py-10 text-[#202b3d] sm:py-16">
      <section className="w-full max-w-lg rounded-2xl border border-[#e6e9ee] bg-white p-8 text-center shadow-[0_2px_9px_rgba(31,42,55,0.08)] sm:p-12">
        <BrandMark className="mx-auto mb-6 h-14 w-16" />
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8f8ef] px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] text-[#138a48]"><span className="h-2 w-2 rounded-full bg-[#0e9d4a]" /> Verification QR</div>
        <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-[#202b3d]">Scan to verify</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#667085]">Scan this code with a phone to open the responsive public verification page.</p>
        <div className="mx-auto mt-8 w-fit rounded-2xl border border-[#e6e9ee] bg-white p-4 shadow-[0_2px_9px_rgba(31,42,55,0.08)]">
          <QRCodeSVG value={verificationUrl} size={220} bgColor="#ffffff" fgColor="#1f2a37" includeMargin aria-label={`QR code for ${record.holderName}`} />
        </div>
        <p className="mt-6 font-medium text-[var(--ink)]">{record.holderName}</p>
        <p className="mt-1 font-mono text-xs text-[var(--slate)]">{record.referenceNo}</p>
        <Link to={`/record/${record.slug}`} className="mt-6 inline-block text-sm font-semibold text-[#075b99] underline underline-offset-4">Open verification page</Link>
      </section>
    </main>
  );
}
