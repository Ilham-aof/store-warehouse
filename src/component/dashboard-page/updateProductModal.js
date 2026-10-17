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
import { updateProductAction } from "@/app/action/product/updateProduct";
import { Pencil } from "lucide-react";

export function UpdateProductModal({ isOpen, selectedProduct, onClose }) {
  const [price, setPrice] = useState(String(selectedProduct?.price ?? ""));

  const [state, action, isPending] = useActionState(updateProductAction, null);

  return (
    <main>
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
          <Modal.Dialog className="max-w-5xl max-h-xl space-y-5">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <Pencil size={30} />
                  <h1 className="text-2xl font-bold">Ubah Data Produk</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-3">
                <p className="text-lg text-black">
                  Nama Produk: {selectedProduct?.name}
                </p>
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

                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                  <TextField
                    name="productName"
                    aria-label="productName"
                    type="text"
                    defaultValue={selectedProduct?.name ?? ""}
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Nama produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Nama Produk</Label>
                    <Input
                      placeholder="Nama Produk"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="productCategory"
                    aria-label="productCategory"
                    type="text"
                    defaultValue={selectedProduct?.category ?? ""}
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Kategori produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Kategori</Label>
                    <Input
                      placeholder="Kategori Produk"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="productBrand"
                    aria-label="productBrand"
                    type="text"
                    defaultValue={selectedProduct?.brand ?? ""}
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Brand produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Brand</Label>
                    <Input
                      placeholder="Brand Produk"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="productPrice"
                    aria-label="productPrice"
                    type="text"
                    value={price}
                    onChange={(value) => {
                      setPrice(value.replace(/\D/g, ""));
                    }}
                    validate={(value) => {
                      if (!value) {
                        return "Harga produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Harga</Label>
                    <Input
                      placeholder="Harga Produk"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                </div>
                <div className="flex justify-center">
                  {state?.error && <p className="text-danger">{state.error}</p>}
                </div>
              </Modal.Body>

              <Modal.Footer className="space-x-3">
                <Button type="button" variant="secondary" onPress={onClose}>
                  Batal
                </Button>
                <Button type="submit" isDisabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </main>
  );
}
