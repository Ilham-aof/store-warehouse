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
  const [phone, setPhone] = useState(selectedOutlet?.phone ?? "");
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
          <Modal.Dialog className="max-w-4xl max-h-xl space-y-5">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="text-2xl font-bold">
                Ubah Cabang
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-5">
                <p className="text-lg text-muted">
                  Cabang : {selectedOutlet?.name}
                </p>
                <input
                  type="hidden"
                  name="outletId"
                  aria-label="Outlet Id"
                  defaultValue={selectedOutlet?.id ?? ""}
                />

                <div className="flex gap-4">
                  <TextField
                    name="outletName"
                    aria-label="Outlet Name"
                    type="text"
                    defaultValue={selectedOutlet?.name ?? ""}
                    className="w-full max-w-64"
                    validate={(value) => {
                      if (!value) {
                        return "Nama cabang wajib diisi";
                      }
                    }}
                  >
                    <Label>Nama</Label>
                    <Input
                      placeholder="Nama Cabang"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="outletCode"
                    aria-label="Outlet Code"
                    type="text"
                    defaultValue={selectedOutlet?.code ?? ""}
                    className="w-full max-w-64"
                    validate={(value) => {
                      if (!value) {
                        return "Kode cabang wajib diisi";
                      }
                    }}
                  >
                    <Label>Kode</Label>
                    <Input
                      placeholder="Kode Cabang"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="outletAddress"
                    aria-label="Outlet Address"
                    type="text"
                    defaultValue={selectedOutlet?.address ?? ""}
                    className="w-full max-w-64"
                    validate={(value) => {
                      if (!value) {
                        return "Alamat cabang wajib diisi";
                      }
                    }}
                  >
                    <Label>Alamat</Label>
                    <Input
                      placeholder="Alamat Cabang"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="outletPhone"
                    aria-label="Outlet Phone"
                    type="text"
                    value={phone}
                    onChange={(value) => setPhone(value.replace(/\D/g, ""))}
                    className="w-full max-w-64"
                    validate={(value) => {
                      if (!value) {
                        return "Nomor telepon cabang wajib diisi";
                      }
                      if (!/^08\d{8,11}$/.test(value)) {
                        return "Nomor telepon cabang tidak valid";
                      }
                    }}
                  >
                    <Label>Nomor Telepon</Label>
                    <Input
                      placeholder="Nomor Telepon Cabang"
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
