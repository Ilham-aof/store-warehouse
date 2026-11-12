"use client";
import { Modal, Button, toast } from "@heroui/react";
import { TriangleAlert, Trash } from "lucide-react";
import { useActionState } from "react";
import { deleteProductAction } from "@/app/action/product/deleteProduct";
import { useRouter } from "next/navigation";

export function DeleteProductModal({ isOpen, selectedProduct, onClose }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await deleteProductAction(prevState, formData);

      if (result.success) {
        toast.success("Produk berhasil dihapus");

        onClose();
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal menghapus produk", {
          description: result.error,
        });
      } else {
        toast.danger("Terjadi kesalahan pada server");
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
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <Trash size={30} />
                  <h1 className="text-2xl font-bold">Hapus Produk</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="flex flex-col items-center">
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
                <TriangleAlert
                  size={200}
                  strokeWidth={1.5}
                  className="text-danger"
                />
                <p className="text-lg text-black text-center">
                  Apakah Anda yakin ingin menghapus produk{" "}
                  <span className="font-bold text-black">
                    "{selectedProduct?.name}"
                  </span>
                  ?
                </p>
                <p className="test-muted text-center">
                  Tindakan ini tidak dapat dibatalkan dan data produk akan
                  dihapus secara permanen
                </p>
                <div>
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
                <Button variant="danger" type="submit" isDisabled={isPending}>
                  {isPending ? "Menghapus..." : "Hapus"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
