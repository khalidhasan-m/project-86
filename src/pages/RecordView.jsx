import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { api } from "../utils/api";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

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
    return <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] text-sm text-[var(--slate)]">Loading record…</main>;
  }

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-5 text-[var(--ink)]">
        <section className="w-full max-w-md rounded-lg border border-[var(--paper-line)] bg-white/45 px-6 py-14 text-center sm:px-10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--paper-line)] font-display text-2xl text-[var(--slate)]">?</div>
          <h1 className="font-display text-4xl">Record not found</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--slate)]">The link may be incorrect, expired, or the record may no longer be available in this browser.</p>
          <Link to="/login" className="mt-7 inline-block text-sm font-semibold text-[var(--seal)] underline decoration-[var(--seal-soft)] underline-offset-4">Return to sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-4 py-10 text-[var(--ink)] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between gap-4 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slate)] print:hidden">
          <span>Public verification</span>
          <button type="button" onClick={() => window.print()} className="transition hover:text-[var(--seal)] focus:outline-none focus:ring-2 focus:ring-[var(--seal)]">Print record</button>
        </div>

        <article className="relative overflow-hidden rounded-lg border border-[var(--paper-line)] bg-white/55 px-6 py-10 shadow-[0_18px_60px_rgba(31,42,55,0.07)] sm:px-14 sm:py-14">
          <div className="pointer-events-none absolute inset-4 rounded-md border border-[var(--paper-line)] opacity-60" />
          <div className="relative">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--ink)] font-display text-2xl">V</div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--seal)]">Authenticity record</p>
              <h1 className="font-display text-5xl leading-none sm:text-6xl">Verified Record</h1>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--slate)]">This record is presented exactly as stored in the verification registry.</p>
            </div>

            <dl className="divide-y divide-[var(--paper-line)] border-y border-[var(--paper-line)]">
              <Detail label="Holder name" value={record.holderName} />
              <Detail label="Reference number" value={record.referenceNo} mono />
              <Detail label="Amount" value={record.amount} />
              <Detail label="Issue date" value={formatDate(record.issueDate)} />
            </dl>

            <div className="flex flex-col items-center justify-between gap-8 pt-10 sm:flex-row sm:items-end">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 rotate-[-9deg] items-center justify-center rounded-full border-2 border-[var(--seal)] text-center text-[10px] font-bold uppercase leading-3 tracking-[0.12em] text-[var(--seal)]">
                  Verified
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--seal)]">Status</p>
                  <p className="mt-1 text-sm font-medium">Authenticity confirmed</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-md border border-[var(--paper-line)] bg-white p-2">
                  <QRCodeSVG value={window.location.href} size={96} bgColor="#ffffff" fgColor="#1f2a37" includeMargin={false} aria-label="QR code for this verified record" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--slate)]">Scan to verify</span>
              </div>
            </div>
          </div>
        </article>
        <p className="mt-6 text-center text-xs text-[var(--slate)]">Reference <span className="font-mono">{record.referenceNo}</span></p>
      </div>
    </main>
  );
}

function Detail({ label, value, mono = false }) {
  return (
    <div className="grid gap-2 py-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-8">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slate)]">{label}</dt>
      <dd className={`text-base font-medium sm:text-right ${mono ? "font-mono text-sm" : ""}`}>{value}</dd>
    </div>
  );
}
