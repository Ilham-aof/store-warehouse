"use client";

import { Modal, Button, toast } from "@heroui/react";
import { TriangleAlert, Trash } from "lucide-react";
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
          <Modal.Dialog className="w-fit max-w-[90vw]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="flex space-x-3 items-center text-2xl font-bold">
                <Trash size={30} />
                <span className="text-2xl font-bold"> Hapus Cabang</span>
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
                  size={200}
                  strokeWidth={1.5}
                  className="text-danger"
                />
                <p className="text-lg text-center">
                  Apa Anda yakin akan menghapus cabang{" "}
                  <span className="font-bold text-black">
                    {selectedOutlet?.name}
                  </span>{" "}
                  ?
                </p>
                <p className="test-muted text-center">
                  Penghapusan ini bersifat permanen dan tidak bisa dibatalkan.
                </p>
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
