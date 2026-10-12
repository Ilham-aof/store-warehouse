"use client";
import {
  Modal,
  Input,
  TextField,
  FieldError,
  Label,
  Button,
} from "@heroui/react";
import { useState, useActionState } from "react";
import { stockOutAction } from "@/app/action/product/takeStockProduct";

export function TakeProductStockModal({ isOpen, selectedProduct, onClose }) {
  const [quantity, setQuantity] = useState("");

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
              <Modal.Heading className="text-2xl font-bold">
                Ambil Stok
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-5">
                <p className="text-lg text-muted">
                  Produk : {selectedProduct?.name}
                </p>
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
                    type="tel"
                    value={quantity}
                    onChange={(value) => {
                      setQuantity(value.replace(/\D/g, ""));
                    }}
                    validate={(value) => {
                      if (!value) {
                        return "Quantity produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Kurangi Stok</Label>
                    <Input
                      placeholder="Masukkan disini"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <div className="min-h-6">
                    {state?.error && (
                      <p className="text-danger text-center">{state.error}</p>
                    )}
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
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
