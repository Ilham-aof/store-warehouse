"use client";
import { Modal, Button, toast } from "@heroui/react";
import { TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { deleteUserAction } from "@/app/action/user/deleteUser";
import { useRouter } from "next/navigation";

export function DeleteUserModal({ isOpen, selectedUser, onClose }) {
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await deleteUserAction(prevState, formData);

      if (result.success) {
        toast.success("Staff berhasil dihapus");

        onClose();
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal menghapus staff", {
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
                Hapus User
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
                  size={250}
                  strokeWidth={1.5}
                  className="text-danger"
                />
                <p className="text-lg">
                  Apa anda yakin akan menghapus User{" "}
                  <span className="font-bold text-black">
                    {selectedUser?.name}
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
