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
    return <main className="flex min-h-screen items-center justify-center bg-[#fbfcff] text-sm text-[#667085]">Loading certificate…</main>;
  }

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfcff] px-5 text-[#202b3d]">
        <section className="w-full max-w-md rounded-2xl border border-[#e6e9ee] bg-white px-6 py-14 text-center shadow-[0_2px_9px_rgba(31,42,55,0.08)] sm:px-10">
          <BrandMark className="mx-auto" />
          <h1 className="mt-7 text-3xl font-bold">Certificate not found</h1>
          <p className="mt-3 text-sm leading-6 text-[#667085]">This QR code is not linked to an available certificate.</p>
          <Link to="/dashboard" className="mt-7 inline-block text-sm font-semibold text-[#075b99] underline underline-offset-4">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, "");
  const verificationUrl = `${publicAppUrl}/record/${record.slug}`;
  const issuedDate = formatDate(record.issueDate);

  return (
    <main className="min-h-screen bg-[#eef1f5] px-3 py-5 text-[#202b3d] sm:px-6 sm:py-10 print:bg-white print:p-0">
      <div className="print-toolbar mx-auto mb-4 flex max-w-[900px] items-center justify-between gap-3 rounded-xl border border-[#dce3ea] bg-white px-4 py-3 shadow-[0_2px_9px_rgba(31,42,55,0.06)] sm:px-5">
        <Link to={`/record/${record.slug}`} className="text-sm font-semibold text-[#075b99] underline underline-offset-4">Open verification page</Link>
        <button type="button" onClick={() => window.print()} className="rounded-xl bg-[#075b99] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064b7d] focus:outline-none focus:ring-2 focus:ring-[#d9eaf7]">Print / Save PDF</button>
      </div>

      <article className="certificate-sheet mx-auto max-w-[900px] bg-white px-6 py-8 shadow-[0_10px_35px_rgba(31,42,55,0.12)] sm:px-12 sm:py-12 print:max-w-none print:px-[18mm] print:py-[16mm] print:shadow-none">
        <header className="border-b-2 border-[#202b3d] pb-5">
          <div className="grid items-start gap-6 sm:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-4">
              <BrandMark className="h-16 w-[74px]" />
              <div>
                <p className="text-[31px] font-black leading-none tracking-[-0.07em] text-[#202b3d] sm:text-[40px]">VERITY</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#075b99]">Financial verification services</p>
              </div>
            </div>
            <div className="certificate-qr justify-self-end rounded-lg border border-[#dce3ea] p-2 text-center">
              <QRCodeSVG value={verificationUrl} size={96} bgColor="#ffffff" fgColor="#202b3d" includeMargin aria-label={`QR code for ${record.holderName}`} />
              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#667085]">Scan to verify</p>
            </div>
          </div>
          <div className="mt-5 grid gap-1 text-[10px] leading-4 text-[#667085] sm:grid-cols-2">
            <p><strong className="text-[#202b3d]">Verification registry</strong><br />Digital certificate operations</p>
            <p className="sm:text-right"><strong className="text-[#202b3d]">Public record</strong><br />{record.slug}</p>
          </div>
        </header>

        <div className="mt-6 flex items-center justify-between gap-4 text-xs font-bold text-[#202b3d]">
          <span>REF# {record.referenceCode || record.referenceNo}</span>
          <span>DATE: {issuedDate}</span>
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-xl font-black tracking-[0.03em] text-[#202b3d] sm:text-2xl">BALANCE CERTIFICATE</h1>
          <p className="mt-2 text-lg font-black tracking-[0.02em] text-[#202b3d] sm:text-xl">TO WHOM IT MAY CONCERN</p>
        </div>

        <p className="mt-8 text-sm leading-6 text-[#202b3d] sm:text-[15px] sm:leading-7">
          We hereby certify that <strong>{record.holderName}</strong>, maintaining account number <strong>{record.referenceNo}</strong> with Verity Financial Verification Services, {record.branch}, has the following account position as of {issuedDate}.
        </p>

        <div className="mt-7 overflow-hidden border border-[#202b3d]">
          <table className="w-full border-collapse text-left text-[12px] leading-5 sm:text-sm">
            <tbody>
              <TableRow label="Account Holder" value={record.holderName} />
              <TableRow label="Account Number" value={record.referenceNo} />
              <TableRow label="Branch" value={record.branch} />
              <TableRow label="Branch Code" value={record.branchCode} />
              <TableRow label="Type of Account" value={record.accountType} />
              <TableRow label="Currency" value={record.currency} />
              <TableRow label="Date of Opening" value={formatDate(record.openingDate)} />
              <TableRow label="Swift Code" value={record.swiftCode} />
              <TableRow label="Routing No" value={record.routingNo} />
              <TableRow label={`Balance in BDT as of ${issuedDate}`} value={record.amount} />
              <TableRow label={`Balance in USD as of ${issuedDate}`} value={record.balanceUsd} />
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-sm font-semibold leading-6 text-[#202b3d]">Today’s exchange rate is maintained by the issuing institution and may vary by date.</p>
        <p className="mt-6 text-sm leading-6 text-[#202b3d]">This certificate has been issued at the request of the account holder and is valid only for the purpose for which it was requested. It is subject to verification through the QR code above.</p>
        <p className="mt-7 text-sm font-bold text-[#202b3d]">For Verity Financial Verification Services</p>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 sm:gap-16">
          <SignatureLine />
          <SignatureLine />
        </div>
      </article>
    </main>
  );
}

function TableRow({ label, value }) {
  return (
    <tr>
      <th className="w-1/2 border-r border-b border-[#202b3d] bg-[#f7f9fb] px-2 py-1.5 font-bold text-[#202b3d] sm:px-3">{label}</th>
      <td className="border-b border-[#202b3d] px-2 py-1.5 font-semibold text-[#202b3d] sm:px-3">{value || "—"}</td>
    </tr>
  );
}

function SignatureLine() {
  return (
    <div className="text-center text-xs font-bold text-[#202b3d]">
      <div className="mx-auto mb-2 max-w-[190px] border-b border-[#202b3d]" />
      Authorized Signatory
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()].map((part) => String(part).padStart(2, "0")).join(":");
  return `${day}-${month}-${year} ${time}`;
}
