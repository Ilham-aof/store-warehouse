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
import { useState, useActionState } from "react";
import { updateProductAction } from "@/app/action/product/updateProduct";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export function UpdateProductModal({ isOpen, selectedProduct, onClose }) {
  const router = useRouter();
  const [price, setPrice] = useState(String(selectedProduct?.price ?? ""));

  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await updateProductAction(prevState, formData);

      if (result.success) {
        toast.success("Perubahan data produk berhasil disimpan");

        onClose();
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal mengubah data produk", {
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
        <Modal.Container size="lg">
          <Modal.Dialog className="space-y-3">
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
              <Modal.Body className="space-y-3  ">
                <p>Detail Produk</p>
                <p className="text-lg font-bold text-black">
                  {selectedProduct?.name}
                </p>
                <Separator />
                <div>
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
                </div>

                <Separator />

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

                <div className="grid grid-cols-2 gap-x-5">
                  <TextField
                    name="productName"
                    aria-label="productName"
                    variant="secondary"
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
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="productCategory"
                    aria-label="productCategory"
                    variant="secondary"
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
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="productBrand"
                    aria-label="productBrand"
                    variant="secondary"
                    type="text"
                    defaultValue={selectedProduct?.brand ?? ""}
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Merek produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Merek</Label>
                    <Input
                      placeholder="Merek Produk"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="productPrice"
                    aria-label="productPrice"
                    variant="secondary"
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
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                </div>
                <div className="text-center">
                  {state?.error && <p className="text-danger">{state.error}</p>}
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
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
