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

export function UpdateProductModal({ isOpen, selectedProduct, onClose }) {
  const [price, setPrice] = useState(String(selectedProduct?.price ?? ""));

  const [state, action, isPending] = useActionState(updateProductAction, null);

  return (
    <main>
      <Modal>
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
            <Modal.Dialog className="max-w-5xl max-h-xl">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading className="text-xl">Ubah Produk</Modal.Heading>
              </Modal.Header>
              <form action={action}>
                <Modal.Body className="space-y-5">
                  <p className="text-lg">Produk: {selectedProduct?.name}</p>
                  <input
                    type="hidden"
                    name="productId"
                    defaultValue={selectedProduct?.id ?? ""}
                  />

                  <div className="flex gap-4">
                    <TextField
                      name="productName"
                      aria-label="productName"
                      type="text"
                      defaultValue={selectedProduct?.name ?? ""}
                      className="w-full max-w-64"
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
                      name="productType"
                      aria-label="productType"
                      type="text"
                      defaultValue={selectedProduct?.type ?? ""}
                      className="w-full max-w-64"
                      validate={(value) => {
                        if (!value) {
                          return "Tipe produk wajib diisi";
                        }
                      }}
                    >
                      <Label>Tipe</Label>
                      <Input
                        placeholder="Tipe Produk"
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
                      className="w-full max-w-64"
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
                      type="tel"
                      defaultValue={String(selectedProduct?.price ?? "")}
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
                  {state?.error && <p className="text-danger">{state.error}</p>}
                </Modal.Body>

                <Modal.Footer>
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
      </Modal>
    </main>
  );
}
