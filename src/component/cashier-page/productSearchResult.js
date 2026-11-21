"use client";

import { Button, Separator, toast } from "@heroui/react";
import { ScanBarcode, LoaderCircle, PackageSearch } from "lucide-react";
import { useActionState } from "react";
import { createSaleReceiptAction } from "@/app/action/saleReceipt/createSaleReceipt";
import { useRouter } from "next/navigation";

export function ProductSearchResult({
  items,
  message,
  hasSearched,
  onSubmitSuccess,
  isSearching,
  selectedOutletId,
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await createSaleReceiptAction(prevState, formData);

      if (result.success) {
        toast.success("Nota Penjualan berhasil dibuat");

        onSubmitSuccess();
        router.push(result.redirectUrl);
      } else if (result.error) {
        toast.danger("Gagal membuat nota penjualan", {
          description: result.error,
        });
      } else {
        toast.danger("Periksa kembali data yang kamu masukkan");
      }

      return result;
    },
    {
      success: false,
      error: null,
    },
  );

  const totalHarga = items.reduce(
    (total, item) => total + item.price * item.addQuantity,
    0,
  );

  const totalProduk = items.reduce(
    (total, item) => total + Number(item.addQuantity),
    0,
  );

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-5">
        <input
          type="hidden"
          name="outletId"
          value={selectedOutletId ?? ""}
          readOnly
        />

        <input type="hidden" name="redirectTo" value="/cashier" readOnly />

        <input
          type="hidden"
          name="items"
          value={JSON.stringify(
            items.map((item) => ({
              productId: item.id,
              quantity: Number(item.addQuantity),
            })),
          )}
          readOnly
        />

        {!isSearching && items.length === 0 && !hasSearched && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <ScanBarcode size={40} />
            <p className="font-medium text-gray-600">
              Belum ada produk yang dicari
            </p>
            <p className="text-center text-sm">
              Scan barcode produk atau masukkan barcode pada kolom pencarian.
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted">Barcode: {item.barcode}</p>
                  <p className="text-sm text-muted">
                    Stok saat ini: {item.quantity} pcs
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(item.price)}
                  </p>
                  <p className="text-xl font-bold">{item.addQuantity} pcs</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isSearching && hasSearched && message && (
          <div className="py-8 text-center">
            <PackageSearch size={40} className="mx-auto mb-3" />
            <p className="font-semibold">Produk tidak ditemukan</p>
            <p className="text-sm text-red-500">{message}</p>
          </div>
        )}

        {isSearching && (
          <div className="flex items-center justify-center gap-3 py-4 text-gray-500">
            <LoaderCircle size={24} className="animate-spin" />
            <p className="text-sm">Mencari produk...</p>
          </div>
        )}

        {items.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="text-sm text-muted">Total Harga</p>
                <p className="text-xl font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalHarga)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted">Total Produk </p>
                <p className="text-xl font-semibold">{totalProduk}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-5">
              <Button
                type="submit"
                isDisabled={isPending || isSearching}
                className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
              >
                {isPending ? "Memproses..." : "Proses Pembayaran"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
