"use client";

import { Button } from "@heroui/react";
import { useRef } from "react";
import { FileDown, Printer } from "lucide-react";
import { useRouter } from "next/navigation";

export function PrintServiceReceipt({ receipt }) {
  const receiptRef = useRef(null);
  const router = useRouter();
  const subtotal = receipt.serviceItems.reduce(
    (sum, service) => sum + service.price,
    0,
  );

  const total = subtotal - receipt.discount;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  function printReceipt() {
    window.print();
  }

  async function downloadPDF() {
    const element = receiptRef.current;

    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const heightPx = element.scrollHeight;
    const heightMm = (heightPx * 25.4) / 96;
    const pageHeight = heightMm + 2;

    await html2pdf()
      .set({
        margin: 0,
        filename: `nota-servis-${receipt.invoiceNumber}.pdf`,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 3,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: [80, pageHeight],
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
        },
      })
      .from(element)
      .save();
  }

  return (
    <section className="flex flex-1 min-h-0 w-full flex-col items-center gap-4">
      <div className="bg-black w-full p-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center">
        <div
          ref={receiptRef}
          className="receipt box-border w-[80mm] bg-white p-5 text-black"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "10pt",
          }}
        >
          <header className="flex flex-col items-center">
            <h1 className="text-xl font-black">{receipt.outlet.name}</h1>

            <p>{receipt.outlet.address}</p>
            <p>Telp: {receipt.outlet.phone}</p>
            <p className="font-bold">
              {receipt.processStatus
                ? "NOTA SERVIS HP"
                : "NOTA SEMENTARA SERVIS HP"}
            </p>
          </header>

          <section>
            <div className="mt-1 w-full border-t-2 border-solid border-black" />
            <div>
              <p>No. Nota: {receipt.invoiceNumber}</p>
              <p>Tanggal: {formatDate(receipt.createdAt)}</p>
              <p>Staff: {receipt.user.name}</p>
            </div>
            <div className="mt-1 w-full border-t-2 border-solid border-black" />
            <div>
              <h2 className="font-bold  border-black">Informasi Customer</h2>

              <div>
                <p>Customer: {receipt.customerName}</p>
                <p>No. HP: {receipt.customerPhone}</p>
                <p>Perangkat: {receipt.device}</p>
                <div>
                  <p>Kelengkapan:</p>
                  {receipt.deviceInclusions?.length > 0 ? (
                    receipt.deviceInclusions.map((item, index) => (
                      <p key={`${item}-${index}`}>- {item}</p>
                    ))
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-1 w-full border-t-2 border-solid border-black" />
            <div>
              <h2 className="font-bold">Rincian Servis</h2>

              {receipt.serviceItems.map((service) => (
                <div
                  key={service.id}
                  className="grid grid-cols-[1fr_auto] items-start gap-4"
                >
                  <div className="flex gap-1 min-w-0">
                    <span className="shrink-0">-</span>
                    <span className="wrap-break-words">
                      {service.description}
                    </span>
                  </div>

                  {/* Kolom Kanan: Harga (Terkunci rata kanan dan sejajar) */}
                  <span className="shrink-0 text-right font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(service.price)}
                  </span>
                </div>
              ))}
              {receipt.discount != 0 && (
                <div className="flex justify-between font-bold mt-3">
                  <span>Potongan</span>
                  <span>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(receipt.discount)}
                  </span>
                </div>
              )}
              <div className="mt-1 w-full border-t-2 border-solid border-black" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(total)}
                </span>
              </div>
            </div>
            <div className="h-0.5 w-full bg-black mt-3" />
            <div>
              <h2 className="font-bold">Informasi Garansi</h2>
              <p>
                {receipt.warrantyDays === 0
                  ? "Garansi: Tidak Bergaransi"
                  : receipt.warrantyDays > 0 && !receipt.warrantyUntil
                    ? "Garansi: -"
                    : `Garansi: ${receipt.warrantyDays} hari`}
              </p>
              <p>
                {receipt.warrantyDays === 0
                  ? ""
                  : receipt.warrantyDays > 0 && !receipt.warrantyUntil
                    ? "Berlaku Hingga: Belum ditentukan"
                    : `Berlaku Hingga: ${formatDate(receipt.warrantyUntil)}`}
              </p>
            </div>
          </section>

          <footer>
            <div className="mt-1 w-full border-t-2 border-solid border-black" />

            <div className="">
              <h3 className=" font-bold">PERINGATAN!</h3>
              <ul className="">
                <li className="flex items-start gap-1">
                  <span className="shrink-0">-</span>
                  <span>
                    HP bermasalah hukum menjadi tanggung jawab pemilik.
                  </span>
                </li>

                <li className="flex items-start gap-1">
                  <span className="shrink-0">-</span>
                  <span>Pengambilan dan retur wajib membawa nota.</span>
                </li>

                <li className="flex items-start gap-1">
                  <span className="shrink-0">-</span>
                  <span>Garansi batal jika segel rusak.</span>
                </li>

                <li className="flex items-start gap-1">
                  <span className="shrink-0">-</span>
                  <span>Pergantian LCD/TS tidak ada garansi.</span>
                </li>

                <li className="flex items-start gap-1">
                  <span className="shrink-0">-</span>
                  <span>
                    HP yang tidak diambil lebih dari 1 bulan, jika rusak atau
                    hilang bukan tanggung jawab kami.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-1 w-full border-t-2 border-solid border-black" />

            <p className="text-center">Terima kasih atas kepercayaan Anda.</p>
          </footer>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <Button
          onClick={() => router.push("/")}
          variant="secondary"
          className="text-slate-800"
        >
          Kembali
        </Button>

        <div className="space-x-3">
          <Button
            type="button"
            onClick={downloadPDF}
            className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
          >
            <FileDown />
            Download PDF
          </Button>
          <Button
            type="button"
            onClick={printReceipt}
            className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
          >
            <Printer />
            Cetak Nota
          </Button>
        </div>
      </div>
    </section>
  );
}
