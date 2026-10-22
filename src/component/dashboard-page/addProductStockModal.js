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
import { useActionState } from "react";
import { stockInAction } from "@/app/action/product/addStockProduct";
import { PackagePlus } from "lucide-react";

export function AddProductStockModal({ isOpen, selectedProduct, onClose }) {
  const [state, action, isPending] = useActionState(stockInAction, null);

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
          <Modal.Dialog className="space-y-5">
            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <PackagePlus size={30} />
                  <h1 className="text-2xl font-bold">Tambah Stok Produk</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-5">
                <div className="space-y-2">
                  <p>Detail Produk</p>
                  <p className="text-lg font-bold text-black">
                    {selectedProduct?.name}
                  </p>
                  <Separator />
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
                    <span className="text-muted">Brand</span>
                    <span className="text-black">{selectedProduct?.brand}</span>
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

                <TextField
                  name="addQuantity"
                  aria-label="addQuantity"
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
