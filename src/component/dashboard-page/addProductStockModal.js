"use client";
import {
  Modal,
  Input,
  TextField,
  FieldError,
  Label,
  Button,
  Separator,
} from "@heroui/react";
import { useActionState, useState } from "react";
import { stockInAction } from "@/app/action/product/addStockProduct";
import { PackagePlus } from "lucide-react";
import { StockInSelection } from "@/component/stockInSelection";
import { OutletInputForm } from "@/component/outletInputForm";

export function AddProductStockModal({
  isOpen,
  selectedProduct,
  onClose,
  outlets,
  label,
}) {
  const [state, action, isPending] = useActionState(stockInAction, null);
  const [stockInSelection, setStockInSelection] = useState("PEMBELIAN");
  return (
    <>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClose();
          }
        }}
        isDismissable={false}
      >
        <Modal.Container>
          <Modal.Dialog className="space-y-3">
            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <PackagePlus size={30} />
                  <h1 className="text-2xl font-bold">Tambah Stok Produk</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-3">
                <div className="space-y-1">
                  <p>Detail Produk</p>
                  <p className="text-lg font-bold text-black">
                    {selectedProduct?.name}
                  </p>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted">Cabang</span>
                    <span className="text-black">
                      {selectedProduct?.outlet.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted">Barcode</span>
                    <span className="text-black">
                      {selectedProduct?.barcode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Kategori</span>
                    <span className="text-black">
                      {selectedProduct?.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Merek</span>
                    <span className="text-black">{selectedProduct?.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Harga</span>
                    <span className="text-black">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(selectedProduct?.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Sisa Stok</span>
                    <span className="text-black">
                      {selectedProduct?.quantity}
                    </span>
                  </div>
                </div>

                <input
                  type="hidden"
                  name="productId"
                  defaultValue={selectedProduct?.id ?? ""}
                />

                <input
                  type="hidden"
                  name="outletId"
                  defaultValue={selectedProduct?.outletId ?? ""}
                />

                <input type="hidden" name="redirectTo" value="/" readOnly />

                <StockInSelection
                  stockInSelection={stockInSelection}
                  setStockInSelection={setStockInSelection}
                />

                {stockInSelection === "TRANSFER" && (
                  <OutletInputForm outlets={outlets} label={label} />
                )}

                <TextField
                  name="addQuantity"
                  aria-label="addQuantity"
                  variant="secondary"
                  type="number"
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
                <div className="text-center">
                  {state?.error && (
                    <p className="text-danger text-center">{state.error}</p>
                  )}
                </div>
              </Modal.Body>

              <Modal.Footer className="space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onPress={onClose}
                  className="text-slate-800"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  isDisabled={isPending}
                  className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
                >
                  {isPending ? "menambahkan Stok..." : "Tambahkan Stok"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
