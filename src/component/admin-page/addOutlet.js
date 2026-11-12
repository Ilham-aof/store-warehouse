"use client";

import {
  TextField,
  Input,
  Button,
  ErrorMessage,
  FieldError,
  Label,
  Modal,
  toast,
} from "@heroui/react";
import { useActionState, useState } from "react";
import { addOutletAction } from "@/app/action/outlet/addOutletAction";
import { Plus, BuildingComplexPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddOutlet() {
  const router = useRouter();
  const [outletCode, setOutletCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await addOutletAction(prevState, formData);

      if (result.success) {
        toast.success("Cabang baru berhasil ditambahkan");
        setIsOpen(false);
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal menambahkan cabang", {
          description: result.error,
        });
      } else {
        toast.danger("Periksa kembali data yang kamu masukkan");
      }

      return result;
    },
    {
      success: false,
      error: null,
    },
  );
  const [phone, setPhone] = useState("");
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button
          type="submit"
          isDisabled={isPending}
          onPress={() => setIsOpen(true)}
          className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
        >
          <Plus />
          {isPending ? "Menambahkan..." : "Tambah Cabang"}
        </Button>
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container>
            <Modal.Dialog className="max-w-4xl max-h-xl space-y-5">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-2xl font-bold">
                  <div className="flex space-x-3 items-center">
                    <BuildingComplexPlus size={30} />
                    <h1 className="text-2xl font-bold">Tambah Cabang Baru</h1>
                  </div>
                </Modal.Heading>
              </Modal.Header>
              <form action={action}>
                <Modal.Body className="space-y-3">
                  <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                    <TextField
                      name="outletName"
                      aria-label="Outlet Name"
                      variant="secondary"
                      type="text"
                      validate={(value) => {
                        if (!value) return "Nama cabang wajib diisi";
                      }}
                    >
                      <Label>Nama Cabang</Label>
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
                      variant="secondary"
                      type="text"
                      value={outletCode}
                      onChange={(value) => {
                        setOutletCode(
                          value
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .toUpperCase()
                            .slice(0, 5),
                        );
                      }}
                      validate={(value) => {
                        if (!value) {
                          return "Kode cabang wajib diisi";
                        }

                        if (!/^[A-Z0-9]{2,5}$/.test(value)) {
                          return "Kode cabang harus 2–5 huruf";
                        }
                      }}
                    >
                      <Label>Kode Cabang</Label>
                      <Input
                        placeholder="Maks. 5 Huruf (ex: WRLG)"
                        maxLength={5}
                        className="hover:bg-gray-200 focus:ring-slate-800"
                      />
                      <div className="min-h-6">
                        <FieldError />
                      </div>
                    </TextField>

                    <TextField
                      name="outletAddress"
                      aria-label="Outlet Address"
                      variant="secondary"
                      type="text"
                      validate={(value) => {
                        if (!value) return "Alamat cabang wajib diisi";
                      }}
                    >
                      <Label>Alamat Cabang</Label>
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
                      variant="secondary"
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
                      <Label>Nomor HP / WA Cabang</Label>
                      <Input
                        placeholder="Nomor Cabang"
                        className="hover:bg-gray-200 focus:ring-slate-800"
                      />
                      <div className="min-h-6">
                        <FieldError />
                      </div>
                    </TextField>
                  </div>
                  <div className="text-center">
                    {typeof state?.error === "string" && (
                      <ErrorMessage slot="description">
                        {state.error}
                      </ErrorMessage>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer className="space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    slot="close"
                    className="text-slate-800"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={isPending}
                    className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
                  >
                    {isPending ? "Menyimpan..." : "Tambahkan Cabang"}
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
