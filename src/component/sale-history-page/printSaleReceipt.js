"use client";

import { Button } from "@heroui/react";
import { useRef } from "react";
import { FileDown, Printer } from "lucide-react";
import { useRouter } from "next/navigation";

export function PrintSaleReceipt({ receipt }) {
  const receiptRef = useRef(null);
  const router = useRouter();

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
        filename: `nota-sale-${receipt.invoiceNumber}.pdf`,
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
            <p className="font-bold">NOTA TRANSAKSI</p>
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
              <h2 className="font-bold">Rincian Transaksi</h2>

              {receipt.saleItems.map((item) => (
                <div key={item.id} className="text-left">
                  <div className="font-medium wrap-break-words">
                    - {item.productName}
                  </div>

                  <div className="flex justify-between pl-5">
                    <span>{item.productQuantity}x</span>

                    <span className="font-semibold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-1 w-full border-t-2 border-solid border-black" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="shrink-0 text-right">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(receipt.totalAmount)}
                </span>
              </div>
            </div>
          </section>

          <footer className="mt-5">
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
