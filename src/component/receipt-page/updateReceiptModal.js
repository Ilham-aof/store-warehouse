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
import { updateReceiptData } from "@/app/action/serviceReceipt/updateReceiptData";
import { Pencil } from "lucide-react";

export function UpdateReceiptModal({ isOpen, selectedReceipt, onClose }) {
  const [customerPhone, setCustomerPhone] = useState(
    String(selectedReceipt?.customerPhone ?? ""),
  );

  const [state, action, isPending] = useActionState(updateReceiptData, null);

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
          <Modal.Dialog className="max-w-5xl max-h-xl space-y-5">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <Pencil size={30} />
                  <h1 className="text-2xl font-bold">Ubah Data Nota</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-5">
                <p className="text-lg text-black">
                  Kode Nota: {selectedReceipt?.invoiceNumber}
                </p>
                <input
                  type="hidden"
                  name="receiptId"
                  defaultValue={selectedReceipt?.id ?? ""}
                />

                <input
                  type="hidden"
                  name="outletId"
                  defaultValue={selectedReceipt?.outletId ?? ""}
                />

                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                  <TextField
                    name="customerName"
                    aria-label="Customer Name"
                    type="text"
                    defaultValue={selectedReceipt?.customerName ?? ""}
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Nama Pelanggan wajib diisi";
                      }
                    }}
                  >
                    <Label>Nama Pelanggan</Label>
                    <Input
                      placeholder="Nama Pelanggan"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="customerPhone"
                    aria-label="Customer Phone"
                    type="text"
                    defaultValue={String(selectedReceipt?.customerPhone ?? "")}
                    value={customerPhone}
                    onChange={(value) => {
                      setCustomerPhone(value.replace(/\D/g, ""));
                    }}
                    validate={(value) => {
                      if (!value) {
                        return "Nomor pelanggan wajib diisi";
                      }
                    }}
                  >
                    <Label>Nomor HP / WA</Label>
                    <Input
                      placeholder="Nomor Pelanggan (081234567890)"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <TextField
                    name="device"
                    aria-label="Device"
                    type="text"
                    defaultValue={selectedReceipt?.device ?? ""}
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Tipe HP wajib diisi";
                      }
                    }}
                  >
                    <Label>Tipe HP</Label>
                    <Input
                      placeholder="Tipe HP Pelanggan"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <TextField
                    name="warranty"
                    aria-label="Warranty"
                    type="number"
                    defaultValue={String(selectedReceipt?.warrantyDays ?? "")}
                    validate={(value) => {
                      if (!value) {
                        return "Garansi wajib diisi";
                      }
                    }}
                  >
                    <Label>Garansi</Label>
                    <Input
                      placeholder="Masa Garansi (Hari)"
                      className="hover:bg-gray-200"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                </div>
                <div className="flex justify-center">
                  {state?.error && <p className="text-danger">{state.error}</p>}
                </div>
              </Modal.Body>

              <Modal.Footer className="space-x-3">
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
