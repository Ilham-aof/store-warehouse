"use client";

import {
  Modal,
  Input,
  TextField,
  FieldError,
  Label,
  Button,
} from "@heroui/react";

import { stockInAction } from "@/app/action/product/addStockProduct";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useEffect, useState } from "react";
import { StockInSelection } from "@/component/stockInSelection";
import { OutletInputForm } from "@/component/outletInputForm";

export function ProductSearchResult({
  product,
  message,
  selectedOutletId,
  addQuantity,
  setAddQuantity,
  onStockInComplete,
  outlets,
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(stockInAction, null);
  const wasPending = useRef(false);
  const [stockInSelection, setStockInSelection] = useState("PEMBELIAN");

  useEffect(() => {
    if (isPending) {
      wasPending.current = true;
    } else if (wasPending.current) {
      wasPending.current = false;
      onStockInComplete?.();
    }
  }, [isPending, onStockInComplete]);

  if (!product) {
    if (!message) return null;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-xl border-3 border-default bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm text-gray-500">Detail Produk</p>
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Kategori</p>
            <p className="font-medium">{product.category}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Merek</p>
            <p className="font-medium">{product.brand}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Harga</p>
            <p className="font-medium">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Stok saat ini</p>
            <p className="font-medium">{product.quantity} pcs</p>
          </div>
        </div>
      </div>

      <div>
        <form action={action}>
          <input type="hidden" name="productId" defaultValue={product.id} />
          <input
            type="hidden"
            name="outletId"
            defaultValue={selectedOutletId ?? ""}
          />
          <input
            type="hidden"
            name="redirectTo"
            value="/add-product-stock"
            readOnly
          />
          <div className="flex w-full items-start gap-5">
            <div className="w-full">
              <TextField
                name="addQuantity"
                aria-label="addQuantity"
                variant="secondary"
                type="number"
                className="w-full"
                value={addQuantity}
                onChange={(value) => {
                  setAddQuantity(value === "" ? "" : value);
                }}
                validate={(value) => {
                  if (!value) {
                    return "Quantity produk wajib diisi";
                  }
                }}
              >
                <Label>Jumlah Stok Tambahan</Label>
                <Input
                  placeholder="Contoh: 10"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />
                <div className="min-h-6">
                  <FieldError />
                </div>
              </TextField>
            </div>

            <div className="w-full">
              <StockInSelection
                stockInSelection={stockInSelection}
                setStockInSelection={setStockInSelection}
              />
            </div>

            <div className="w-full">
              {stockInSelection === "TRANSFER" && (
                <OutletInputForm outlets={outlets} label="Terima Dari" />
              )}
            </div>
          </div>
          <div className="text-center">
            {state?.error && (
              <p className="text-danger text-center">{state.error}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/?outletId=${selectedOutletId}`)}
              className="text-slate-800"
            >
              Kembali
            </Button>

            <Button
              type="submit"
              isDisabled={isPending}
              className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
            >
              {isPending ? "menambahkan Stok..." : "Tambahkan Stok"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
