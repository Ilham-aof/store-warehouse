"use client";

import {
  TextField,
  Input,
  Button,
  ErrorMessage,
  FieldError,
  Label,
} from "@heroui/react";
import { useActionState } from "react";
import { addOutletAction } from "@/app/action/outlet/addOutletAction";
import { Plus } from "lucide-react";

export function AddOutlet() {
  const [state, action, isPending] = useActionState(addOutletAction, null);
  return (
    <>
      <form action={action}>
        <div className="flex gap-5">
          <TextField
            name="outletName"
            aria-label="Outlet Name"
            type="text"
            className="w-64"
            validate={(value) => {
              if (!value) {
                return "Nama cabang wajib diisi";
              }
            }}
          >
            <Label>Tambahkan Cabang</Label>
            <Input placeholder="Nama Cabang" className="hover:bg-gray-200" />
            <div className="min-h-6">
              <FieldError />
            </div>
          </TextField>
          <TextField
            name="outletCode"
            aria-label="Outlet Code"
            type="text"
            className="w-48"
            validate={(value) => {
              if (!value) {
                return "Kode cabang wajib diisi";
              }
            }}
          >
            <Label>Kode Cabang</Label>
            <Input placeholder="Kode Cabang" className="hover:bg-gray-200" />
            <div className="min-h-6">
              <FieldError />
            </div>
          </TextField>
        </div>
        <div className="min-h-6">
          {state?.error && <ErrorMessage>{state.error}</ErrorMessage>}
        </div>
        <Button type="submit" isDisabled={isPending}>
          <Plus />
          {isPending ? "Menambahkan..." : "Tambah Cabang"}
        </Button>
      </form>
    </>
  );
}
