"use client";
import {
  Modal,
  Input,
  TextField,
  FieldError,
  Label,
  Button,
  Select,
  ListBox,
} from "@heroui/react";
import { useState, useActionState } from "react";
import { updateReceiptData } from "@/app/action/serviceReceipt/updateReceiptData";
import { Pencil } from "lucide-react";

const accessoryLabels = {
  handphone: "Handphone",
  simcard: "SIM Card",
  charger: "Charger",
  battery: "Battery",
  memory: "Memory",
  softcase: "Soft Case",
};

const accessoryIdsByLabel = Object.fromEntries(
  Object.entries(accessoryLabels).map(([id, label]) => [label, id]),
);

function getAccessoryIds(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (Object.prototype.hasOwnProperty.call(accessoryLabels, item)) {
        return item;
      }

      return accessoryIdsByLabel[item];
    })
    .filter(Boolean);
}

export function UpdateReceiptModal({ isOpen, selectedReceipt, onClose }) {
  const [customerPhone, setCustomerPhone] = useState(
    String(selectedReceipt?.customerPhone ?? ""),
  );

  const [selectedDeviceInclusions, setSelectedDeviceInclusions] = useState(() =>
    getAccessoryIds(selectedReceipt?.deviceInclusions),
  );

  const [showDeviceInclusionsError, setShowDeviceInclusionsError] =
    useState(false);

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
                    variant="secondary"
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
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="customerPhone"
                    aria-label="Customer Phone"
                    variant="secondary"
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
                      placeholder="Nomor Pelanggan"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <TextField
                    name="device"
                    aria-label="Device"
                    variant="secondary"
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
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <TextField
                    name="warranty"
                    aria-label="Warranty"
                    variant="secondary"
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
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <Select
                    name="deviceInclusions"
                    variant="secondary"
                    placeholder="Kelengkapan HP"
                    selectionMode="multiple"
                    value={selectedDeviceInclusions}
                    onChange={(value) => {
                      setSelectedDeviceInclusions(value ?? []);

                      if (value?.length > 0) {
                        setShowDeviceInclusionsError(false);
                      }
                    }}
                    isInvalid={
                      showDeviceInclusionsError &&
                      selectedDeviceInclusions.length === 0
                    }
                  >
                    <Label>Kelengkapan</Label>

                    <Select.Trigger>
                      <Select.Value>
                        {({ defaultChildren, isPlaceholder }) => {
                          if (
                            isPlaceholder ||
                            selectedDeviceInclusions.length === 0
                          ) {
                            return defaultChildren;
                          }

                          const labels = selectedDeviceInclusions
                            .map((value) => accessoryLabels[value])
                            .filter(Boolean);

                          if (labels.length === 0) {
                            return defaultChildren;
                          }

                          if (labels.length === 1) {
                            return labels[0];
                          }

                          if (labels.length === 2) {
                            return `${labels[0]} dan ${labels[1]}`;
                          }

                          return `${labels.slice(0, -1).join(", ")}, dan ${
                            labels[labels.length - 1]
                          }`;
                        }}
                      </Select.Value>

                      <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover>
                      <ListBox selectionMode="multiple">
                        <ListBox.Item id="handphone" textValue="Handphone">
                          Handphone
                          <ListBox.ItemIndicator />
                        </ListBox.Item>

                        <ListBox.Item id="simcard" textValue="SIM Card">
                          SIM Card
                          <ListBox.ItemIndicator />
                        </ListBox.Item>

                        <ListBox.Item id="charger" textValue="Charger">
                          Charger
                          <ListBox.ItemIndicator />
                        </ListBox.Item>

                        <ListBox.Item id="battery" textValue="Battery">
                          Battery
                          <ListBox.ItemIndicator />
                        </ListBox.Item>

                        <ListBox.Item id="memory" textValue="Memory">
                          Memory
                          <ListBox.ItemIndicator />
                        </ListBox.Item>

                        <ListBox.Item id="softcase" textValue="Soft Case">
                          Soft Case
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                    <div className="min-h-6">
                      {showDeviceInclusionsError &&
                        selectedDeviceInclusions.length === 0 && (
                          <FieldError>
                            Pilih minimal satu kelengkapan HP
                          </FieldError>
                        )}
                    </div>
                  </Select>
                </div>
                <div className="text-center">
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
                <Button
                  type="submit"
                  isDisabled={isPending}
                  className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
                >
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
