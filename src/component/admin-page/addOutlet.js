"use client";

import {
  TextField,
  Input,
  Button,
  ErrorMessage,
  FieldError,
  Label,
  Modal,
} from "@heroui/react";
import { useActionState, useState } from "react";
import { addOutletAction } from "@/app/action/outlet/addOutletAction";
import { Plus } from "lucide-react";

export function AddOutlet() {
  const [state, action, isPending] = useActionState(addOutletAction, {
    success: false,
    errors: {},
  });
  const [phone, setPhone] = useState("");
  return (
    <>
      <Modal>
        <Button type="submit" isDisabled={isPending}>
          <Plus />
          {isPending ? "Menambahkan..." : "Tambah Cabang"}
        </Button>
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container>
            <Modal.Dialog className="max-w-4xl max-h-xl space-y-5">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-2xl font-bold">
                  Tambah Cabang
                </Modal.Heading>
              </Modal.Header>
              <form action={action}>
                <Modal.Body className="flex flex-nowrap gap-4">
                  <TextField
                    name="outletName"
                    aria-label="Outlet Name"
                    type="text"
                    validate={(value) => {
                      if (!value) return "Nama cabang wajib diisi";
                    }}
                  >
                    <Label>Nama</Label>
                    <Input placeholder="Nama Cabang" />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <TextField
                    name="outletCode"
                    aria-label="Outlet Code"
                    type="text"
                    validate={(value) => {
                      if (!value) return "Kode cabang wajib diisi";
                    }}
                  >
                    <Label>Kode</Label>
                    <Input placeholder="Kode Cabang" />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>

                  <TextField
                    name="outletAddress"
                    aria-label="Outlet Address"
                    type="text"
                    validate={(value) => {
                      if (!value) return "Alamat cabang wajib diisi";
                    }}
                  >
                    <Label>Alamat</Label>
                    <Input placeholder="Alamat Cabang" />
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
                    <Input placeholder="Nomor Telepon Cabang" />
                    <div className="min-h-6">
                      <FieldError />
                    </div>
                  </TextField>
                </Modal.Body>
                <div className="min-h-6 text-center">
                  {state?.error && (
                    <ErrorMessage slot="description">
                      {state.error}
                    </ErrorMessage>
                  )}
                </div>
                <Modal.Footer>
                  <Button type="button" variant="secondary" slot="close">
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
      </Modal>
    </>
  );
}
