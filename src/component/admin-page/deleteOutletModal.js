"use client";
import { Modal, Button, toast, ErrorMessage } from "@heroui/react";
import { TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { deleteOutletAction } from "@/app/action/outlet/deleteOutletAction";
import { useRouter } from "next/navigation";

export function DeleteOutletModal({ isOpen, selectedOutlet, onClose }) {
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await deleteOutletAction(prevState, formData);

      if (result.success) {
        toast.success("Cabang berhasil dihapus");

        onClose();
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal menghapus cabang", {
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
              <Modal.Heading className="text-2xl font-bold">
                Hapus Cabang
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="flex flex-col items-center">
                <input
                  type="hidden"
                  name="outletId"
                  aria-label="Outlet Id"
                  defaultValue={selectedOutlet?.id ?? ""}
                />
                <TriangleAlert
                  size={250}
                  strokeWidth={1.5}
                  className="text-danger"
                />
                <p className="text-lg text-center">
                  Apa anda yakin akan menghapus cabang{" "}
                  <span className="font-bold text-black">
                    {selectedOutlet?.name}
                  </span>{" "}
                  ?
                </p>
                <div className="text-center">
                  {typeof state?.error === "string" && (
                    <ErrorMessage slot="description">
                      {state.error}
                    </ErrorMessage>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type="button"
                  variant="secondary"
                  onPress={onClose}
                  className="text-slate-800"
                >
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
