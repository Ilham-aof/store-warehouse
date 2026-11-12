"use client";

import { Button, toast } from "@heroui/react";
import { ScanBarcode, LoaderCircle, PackageSearch } from "lucide-react";
import { bulkStockInAction } from "@/app/action/product/bulkAddStockProducts";
import { bulkStockOutAction } from "@/app/action/product/bulkTakeStockProducts";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { StockInSelection } from "@/component/stockInSelection";
import { StockOutSelection } from "@/component/stockOutSelection";
import { OutletInputForm } from "@/component/outletInputForm";

export function ProductSearchResult({
  items,
  message,
  hasSearched,
  onSubmitSuccess,
  isSearching,
  selectedOutletId,
  outlets,
  mode,
}) {
  const router = useRouter();
  const [stockInSelection, setStockInSelection] = useState("PEMBELIAN");
  const [stockOutSelection, setStockOutSelection] = useState("SERVIS");

  const selectedState = mode === "in" ? stockInSelection : stockOutSelection;
  const selectedSetState =
    mode === "in" ? setStockInSelection : setStockOutSelection;
  const selectedRedirect =
    mode === "in" ? "/add-product-stock" : "/take-product-stock";

  const selectedAction = mode === "in" ? bulkStockInAction : bulkStockOutAction;

  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await selectedAction(prevState, formData);

      if (result.success) {
        toast.success(
          mode === "in" ? "Stok berhasil ditambahkan" : "Stok berhasil diambil",
        );

        onSubmitSuccess();
        router.refresh();
      } else if (result.error) {
        toast.danger(
          mode === "in" ? "Gagal menambahkan stok" : "Gagal mengambil stok",
          {
            description: result.error,
          },
        );
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

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-5">
        <input
          type="hidden"
          name="outletId"
          value={selectedOutletId ?? ""}
          readOnly
        />

        <input
          type="hidden"
          name="redirectTo"
          value={selectedRedirect}
          readOnly
        />

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
                  <p className="text-sm text-muted">Jumlah tambahan</p>
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
            <div className="flex w-full items-start gap-5">
              <div className="w-full">
                {mode === "in" ? (
                  <StockInSelection
                    stockInSelection={selectedState}
                    setStockInSelection={selectedSetState}
                  />
                ) : (
                  <StockOutSelection
                    stockOutSelection={selectedState}
                    setStockOutSelection={selectedSetState}
                  />
                )}
                <input
                  type="hidden"
                  name="mutationType"
                  value={selectedState}
                  readOnly
                />
              </div>

              <div className="w-full">
                {(stockInSelection === "TRANSFER" ||
                  stockOutSelection === "TRANSFER") && (
                  <OutletInputForm outlets={outlets} label="Terima Dari" />
                )}
              </div>
            </div>

            {state?.error && (
              <p className="text-center text-danger">{state.error}</p>
            )}

            <div className="flex justify-end space-x-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/?outletId=${selectedOutletId}`)}
                className="text-slate-800"
              >
                Kembali
              </Button>
              {mode === "in" ? (
                <Button
                  type="submit"
                  isDisabled={isPending || isSearching}
                  className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
                >
                  {isPending ? "Menambahkan stok..." : "Tambahkan Stok"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  isDisabled={isPending || isSearching}
                  className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
                >
                  {isPending ? "Mengambil Stok..." : "Ambil Stok"}
                </Button>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
