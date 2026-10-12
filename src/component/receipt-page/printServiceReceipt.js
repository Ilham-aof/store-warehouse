"use client";

import { Button } from "@heroui/react";
import { useRef } from "react";

export function PrintServiceReceipt({ receipt, user }) {
  const receiptRef = useRef(null);

  const total = receipt.serviceItems.reduce(
    (sum, service) => sum + service.price,
    0,
  );

  const formatRupiah = (value) => `Rp${value.toLocaleString("id-ID")}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

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
    <div className="space-y-4">
      <div
        ref={receiptRef}
        className="box-border w-[80mm] bg-white p-5 text-black"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "10pt",
        }}
      >
        <header className="flex flex-col items-center">
          <h1 className="text-xl font-black">{receipt.outlet.name}</h1>

          <p>{receipt.outlet.address}</p>
          <p>Telp: {receipt.outlet.phone}</p>
          <p className="font-bold">NOTA SERVIS HP</p>
        </header>

        <section className="mt-3">
          <div className="h-0.5 w-full bg-black" />
          <div>
            <p>No. Nota: {receipt.invoiceNumber}</p>
            <p>Tanggal: {formatDate(receipt.createdAt)}</p>
            <p>Staff: {user.name}</p>
          </div>
          <div className="h-px w-full bg-black mt-3" />
          <div>
            <h2 className="font-bold  border-black">Informasi Customer</h2>

            <div>
              <p>Customer: {receipt.customerName}</p>
              <p>No. HP: {receipt.customerPhone}</p>
              <p>Perangkat: {receipt.device}</p>
            </div>
          </div>

          <div className="h-px w-full bg-black mt-3" />

          <div>
            <h2 className="font-bold">Rincian Servis</h2>

            {receipt.serviceItems.map((service) => (
              <div key={service.id} className="flex justify-between gap-4">
                <span>{service.description}</span>
                <span>{formatRupiah(service.price)}</span>
              </div>
            ))}

            <div className="h-px w-full bg-black mt-3" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>

          <div className="h-0.5 w-full bg-black mt-3" />

          <div>
            <h2 className="font-bold">Informasi Garansi</h2>
            <p>Waktu Garansi: {receipt.warrantyDays} hari</p>
            <p>
              Berlaku Hingga:{" "}
              {receipt.warrantyUntil
                ? formatDate(receipt.warrantyUntil)
                : "Belum ditentukan"}
            </p>
          </div>
        </section>

        <footer className="mt-3">
          <div className="h-0.5 w-full bg-black" />

          <div className="">
            <h3 className=" font-bold">PERINGATAN!</h3>
            <ul className="">
              <li className="flex items-start gap-1">
                <span className="shrink-0">-</span>
                <span>HP bermasalah hukum menjadi tanggung jawab pemilik.</span>
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
          <div className="h-0.5 w-full bg-black mt-3" />

          <p className="text-center">Terima kasih atas kepercayaan Anda.</p>
        </footer>
      </div>

      <Button type="button" onClick={downloadPDF}>
        Download PDF
      </Button>
    </div>
  );
}
