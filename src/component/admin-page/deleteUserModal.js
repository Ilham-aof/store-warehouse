"use client";
import { Modal, Button, toast } from "@heroui/react";
import { TriangleAlert, UserRoundX } from "lucide-react";
import { useActionState } from "react";
import { deleteUserAction } from "@/app/action/user/deleteUser";
import { useRouter } from "next/navigation";

export function DeleteUserModal({ isOpen, selectedUser, onClose }) {
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await deleteUserAction(prevState, formData);

      if (result.success) {
        toast.success("Staf berhasil dihapus");

        onClose();
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal menghapus staf", {
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
                <UserRoundX size={30} />
                <span className="text-2xl font-bold"> Hapus Staf</span>
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="flex flex-col items-center">
                <input
                  type="hidden"
                  name="userId"
                  defaultValue={selectedUser?.id ?? ""}
                />
                <TriangleAlert
                  size={200}
                  strokeWidth={1.5}
                  className="text-danger"
                />
                <p className="text-lg text-center">
                  Apa Anda yakin akan menghapus staf{" "}
                  <span className="font-bold text-black">
                    {selectedUser?.name}
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
