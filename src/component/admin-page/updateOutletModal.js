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
import { BuildingComplexPlus } from "lucide-react";

export function UpdateOutletModal({ isOpen, selectedOutlet, onClose }) {
  const [outletCode, setOutletCode] = useState(selectedOutlet?.code ?? "");
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
          <Modal.Dialog className="max-w-5xl max-h-xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <BuildingComplexPlus size={30} />
                  <h1 className="text-2xl font-bold">Ubah Data Cabang</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="space-y-5">
                <div></div>
                <p className="text-lg text-black">
                  Cabang : {selectedOutlet?.name}
                </p>
                <input
                  type="hidden"
                  name="outletId"
                  aria-label="Outlet Id"
                  defaultValue={selectedOutlet?.id ?? ""}
                />

                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                  <TextField
                    name="outletName"
                    aria-label="Outlet Name"
                    type="text"
                    defaultValue={selectedOutlet?.name ?? ""}
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Nama cabang wajib diisi";
                      }
                    }}
                  >
                    <Label>Nama</Label>
                    <Input
                      placeholder="Nama Cabang"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="outletCode"
                    aria-label="Outlet Code"
                    type="text"
                    className="w-full"
                    value={outletCode}
                    onChange={(value) => {
                      setOutletCode(
                        value
                          .replace(/[^a-zA-Z]/g, "")
                          .toUpperCase()
                          .slice(0, 5),
                      );
                    }}
                    validate={(value) => {
                      if (!value) {
                        return "Kode cabang wajib diisi";
                      }

                      if (!/^[A-Z]{2,5}$/.test(value)) {
                        return "Kode cabang harus 2–5 huruf";
                      }
                    }}
                  >
                    <Label>Kode</Label>
                    <Input
                      placeholder="Kode Cabang"
                      className="hover:bg-gray-200 focus:ring-slate-800"
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
                    className="w-full"
                    validate={(value) => {
                      if (!value) {
                        return "Alamat cabang wajib diisi";
                      }
                    }}
                  >
                    <Label>Alamat</Label>
                    <Input
                      placeholder="Alamat Cabang"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                  <TextField
                    name="outletPhone"
                    aria-label="Outlet Phone"
                    type="tel"
                    value={phone}
                    onChange={(value) => setPhone(value.replace(/\D/g, ""))}
                    className="w-full"
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
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                </div>
                <div className="text-center">
                  {state?.error && <p className="text-danger">{state.error}</p>}
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
