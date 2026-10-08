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
import { updateOutletAction } from "@/app/action/outlet/updateOutletAction";

export function UpdateOutletModal({ isOpen, selectedOutlet, onClose }) {
  const [state, action, isPending] = useActionState(updateOutletAction, null);

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
          <Modal.Dialog className="w-md max-h-xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="text-2xl font-bold">
                Ubah Cabang
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-5">
                <p className="text-lg">Cabang : {selectedOutlet?.name}</p>
                <input
                  type="hidden"
                  name="outletId"
                  aria-label="Outlet Id"
                  defaultValue={selectedOutlet?.id ?? ""}
                />

                <div className="flex gap-4">
                  <TextField
                    name="outletName"
                    aria-label="outlet Name"
                    type="text"
                    defaultValue={selectedOutlet?.name ?? ""}
                    className="w-full max-w-64"
                    validate={(value) => {
                      if (!value) {
                        return "Nama outlet wajib diisi";
                      }
                    }}
                  >
                    <Label>Nama Outlet</Label>
                    <Input
                      placeholder="Nama Outlet"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                </div>
                <div className="min-h-6">
                  {state?.error && <p className="text-danger">{state.error}</p>}
                </div>
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
    </main>
  );
}
