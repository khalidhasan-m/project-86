import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
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
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-5 py-10 text-[var(--ink)] sm:py-16">
      <section className="w-full max-w-lg rounded-lg border border-[var(--paper-line)] bg-white/55 p-8 text-center shadow-[0_18px_60px_rgba(31,42,55,0.07)] sm:p-12">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ink)] font-display text-xl">V</div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--seal)]">Verification QR</p>
        <h1 className="font-display text-4xl leading-tight">Scan to verify</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--slate)]">Scan this code with a phone to open the responsive public verification page.</p>
        <div className="mx-auto mt-8 w-fit rounded-lg border border-[var(--paper-line)] bg-white p-4">
          <QRCodeSVG value={verificationUrl} size={220} bgColor="#ffffff" fgColor="#1f2a37" includeMargin aria-label={`QR code for ${record.holderName}`} />
        </div>
        <p className="mt-6 font-medium text-[var(--ink)]">{record.holderName}</p>
        <p className="mt-1 font-mono text-xs text-[var(--slate)]">{record.referenceNo}</p>
        <Link to={`/record/${record.slug}`} className="mt-6 inline-block text-sm font-semibold text-[var(--seal)] underline underline-offset-4">Open verification page</Link>
      </section>
    </main>
  );
}
