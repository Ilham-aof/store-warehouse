"use client";
import {
  Modal,
  Input,
  TextField,
  FieldError,
  Label,
  Button,
  Separator,
  toast,
} from "@heroui/react";
import { useActionState, useState } from "react";
import { stockOutAction } from "@/app/action/product/takeStockProduct";
import { PackageMinus } from "lucide-react";
import { StockOutSelection } from "@/component/stockOutSelection";
import { OutletInputForm } from "@/component/outletInputForm";
import { useRouter } from "next/navigation";

export function TakeProductStockModal({
  isOpen,
  selectedProduct,
  onClose,
  outlets,
  label,
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await stockOutAction(prevState, formData);
      if (result.success) {
        toast.success("Stok berhasil diambil");
        onClose();
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal mengambil stok produk", {
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
  const [stockOutSelection, setStockOutSelection] = useState("SERVIS");

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
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <PackageMinus size={30} />
                  <h1 className="text-2xl font-bold">Ambil Stok Produk</h1>
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
                <Separator />

                <input
                  type="hidden"
                  name="productId"
                  aria-label="Product Id"
                  defaultValue={selectedProduct?.id ?? ""}
                />
                <input
                  type="hidden"
                  name="outletId"
                  value={selectedProduct?.outletId ?? ""}
                />
                <StockOutSelection
                  stockOutSelection={stockOutSelection}
                  setStockOutSelection={setStockOutSelection}
                />

                <input
                  type="hidden"
                  name="mutationOutType"
                  value={stockOutSelection}
                />

                {stockOutSelection === "TRANSFER" && (
                  <OutletInputForm outlets={outlets} label={label} />
                )}

                <TextField
                  name="productQuantity"
                  aria-label="productQuantity"
                  variant="secondary"
                  type="number"
                  validate={(value) => {
                    if (!value) {
                      return "Jumlah produk wajib diisi.";
                    }
                  }}
                >
                  <Label>Jumlah Stok Diambil</Label>
                  <Input
                    placeholder="Contoh: 10"
                    className="hover:bg-gray-200 focus:ring-slate-800"
                  />
                  <div className="min-h-6">
                    <FieldError />
                  </div>
                </TextField>
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
                  {isPending ? "Mengambil Stok..." : "Ambil Stok"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
