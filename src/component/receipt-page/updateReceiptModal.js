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

export function UpdateReceiptModal({ isOpen, selectedReceipt, onClose }) {
  const [customerPhone, setCustomerPhone] = useState(
    String(selectedReceipt?.customerPhone ?? ""),
  );

  const [warranty, setWarranty] = useState(
    String(selectedReceipt?.warrantyDays ?? ""),
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
          <Modal.Dialog className="max-w-5xl max-h-xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="text-2xl font-bold">
                Ubah Produk
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-5">
                <p className="text-lg">
                  Kode Nota : {selectedReceipt?.invoiceNumber}
                </p>
                <input
                  type=""
                  name="receiptId"
                  defaultValue={selectedReceipt?.id ?? ""}
                />

                <input
                  type=""
                  name="outletId"
                  defaultValue={selectedReceipt?.outletId ?? ""}
                />

                <div className="flex gap-4">
                  <TextField
                    name="customerName"
                    aria-label="Customer Name"
                    type="text"
                    defaultValue={selectedReceipt?.customerName ?? ""}
                    className="w-full max-w-64"
                    validate={(value) => {
                      if (!value) {
                        return "Nama produk wajib diisi";
                      }
                    }}
                  >
                    <Label>Nama Customer</Label>
                    <Input
                      placeholder="Nama Customer"
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
                        return "Nomor customer wajib diisi";
                      }
                    }}
                  >
                    <Label>Nomor Customer</Label>
                    <Input
                      placeholder="Nomor Customer"
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
                    className="w-full max-w-64"
                    validate={(value) => {
                      if (!value) {
                        return "Device wajib diisi";
                      }
                    }}
                  >
                    <Label>Device</Label>
                    <Input placeholder="Device" className="hover:bg-gray-200" />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <TextField
                    name="warranty"
                    aria-label="Warranty"
                    type="text"
                    defaultValue={String(selectedReceipt?.warrantyDays ?? "")}
                    value={warranty}
                    onChange={(value) => {
                      setWarranty(value.replace(/\D/g, ""));
                    }}
                    validate={(value) => {
                      if (!value) {
                        return "Garansi wajib diisi";
                      }
                    }}
                  >
                    <Label>Garansi</Label>
                    <Input
                      placeholder="Garansi"
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
