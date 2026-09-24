"use client";
import { Modal, Button } from "@heroui/react";
import { TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { deleteProductAction } from "@/app/action/product/deleteProduct";

export function DeleteProductModal({ isOpen, selectedProduct, onClose }) {
  const [state, action, isPending] = useActionState(deleteProductAction, null);

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
          <Modal.Dialog>
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="text-xl">Hapus Produk</Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="flex flex-col items-center">
                <input
                  type="hidden"
                  name="productId"
                  aria-label="Product Id"
                  defaultValue={selectedProduct?.id ?? ""}
                />
                <TriangleAlert
                  size={250}
                  strokeWidth={1.5}
                  className="text-danger"
                />
                <p className="text-lg">
                  Apa anda yakin akan menghapus produk{" "}
                  <span className="font-bold text-black">
                    {selectedProduct?.name}
                  </span>
                  ?
                </p>
                <div className="min-h-6">
                  {state?.error && <p className="text-danger">{state.error}</p>}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button type="button" variant="secondary" onPress={onClose}>
                  Batal
                </Button>
                <Button variant="danger" type="submit" isDisabled={isPending}>
                  {isPending ? "Menghapus..." : "Ya"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
