"use client";
import {
  Modal,
  Input,
  TextField,
  FieldError,
  Label,
  Button,
} from "@heroui/react";
import { useActionState } from "react";
import { stockOutAction } from "@/app/action/product/takeStockProduct";
import { PackageMinus } from "lucide-react";

export function TakeProductStockModal({ isOpen, selectedProduct, onClose }) {
  const [state, action, isPending] = useActionState(stockOutAction, null);

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
              <Modal.Body className="space-y-5">
                <div>
                  <p className="text-lg text-black">
                    Nama Produk: {selectedProduct?.name}
                  </p>
                  <p className="text-muted">
                    Sisa Stok: {selectedProduct?.quantity}
                  </p>
                </div>
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
                <div className="flex flex-col">
                  <TextField
                    name="productQuantity"
                    aria-label="productQuantity"
                    type="number"
                    validate={(value) => {
                      if (!value) {
                        return "Quantity produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Jumlah Stok Diambil</Label>
                    <Input
                      placeholder="Contoh: 10"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <div className="flex justify-center">
                    {state?.error && (
                      <p className="text-danger text-center">{state.error}</p>
                    )}
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer className="space-x-3">
                <Button type="button" variant="secondary" onPress={onClose}>
                  Batal
                </Button>
                <Button type="submit" isDisabled={isPending}>
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
