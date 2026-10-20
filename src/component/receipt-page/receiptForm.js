"use client";

import {
  Button,
  Input,
  TextField,
  ErrorMessage,
  FieldError,
  Label,
  Separator,
} from "@heroui/react";
import { Plus, Trash, FilePlus } from "lucide-react";
import { useState, useActionState } from "react";
import { createServiceReceipt } from "@/app/action/serviceReceipt/createServiceReceipt";
import { OutletSelection } from "@/component/outletSelection";
import { useRouter } from "next/navigation";

export function ReceiptForm({ outlets, selectedOutletId }) {
  const router = useRouter();

  const [services, setServices] = useState([
    {
      description: "",
      price: "",
    },
  ]);

  const [cusPhone, setCusPhone] = useState("");

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        description: "",
        price: "",
      },
    ]);
  };

  const removeService = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const [state, action, isPending] = useActionState(createServiceReceipt, {
    success: false,
    errors: {},
  });

  return (
    <div className="bg-white flex flex-col rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 space-y-5">
      <div className="flex space-x-3 items-center">
        <FilePlus size={30} />
        <h1 className="text-2xl font-bold">Tambah Servis Baru</h1>
      </div>

      <form action={action} className="flex flex-col space-y-5">
        <OutletSelection
          outlets={outlets}
          selectedOutletId={selectedOutletId}
        />
        <input
          type="hidden"
          name="outletId"
          aria-label="Outlet Id"
          value={selectedOutletId ?? ""}
          readOnly
        />
        <div className="grid grid-cols-[2fr_3fr] gap-5">
          <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 h-fit">
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-bold">Data Pelanggan</h2>
              <TextField
                name="customerName"
                aria-label="Customer Name"
                type="text"
                validate={(value) => {
                  if (!value) {
                    return "Nama pelanggan wajib diisi";
                  }
                }}
              >
                <Label>Nama</Label>

                <Input
                  placeholder="Nama Pelanggan"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.cusname ? (
                    <ErrorMessage>{state.errors.cusname}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name="customerPhone"
                aria-label="Cutomer Phone"
                type="tel"
                value={cusPhone}
                onChange={(value) => setCusPhone(value.replace(/\D/g, ""))}
                validate={(value) => {
                  if (!value) {
                    return "Nomor pelanggan wajib diisi";
                  }
                  if (!/^08\d{8,11}$/.test(value)) {
                    return "Nomor HP tidak valid";
                  }
                }}
              >
                <Label>Nomor HP / WA</Label>
                <Input
                  placeholder="Nomor Pelanggan"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.cusphone ? (
                    <ErrorMessage>{state.errors.cusphone}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name="device"
                aria-label="Device Customer"
                type="text"
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
                  {state.errors?.cusitem ? (
                    <ErrorMessage>{state.errors.cusitem}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name="serviceWarranty"
                aria-label="Service Warranty"
                type="number"
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
                  {state.errors?.service ? (
                    <ErrorMessage>{state.errors.serviceWarranty}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
            </div>
          </div>

          <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Data Servis</h2>
              {services.map((item, index) => (
                <div key={index} className="flex space-x-5">
                  <TextField
                    name={`phoneDamageType[${index}][description]`}
                    aria-label="Jenis Kerusakan"
                    type="text"
                    className="w-full"
                    value={item.description}
                    onChange={(value) => {
                      setServices((prev) =>
                        prev.map((service, i) =>
                          i === index
                            ? { ...service, description: value }
                            : service,
                        ),
                      );
                    }}
                    validate={(value) => {
                      if (!value) {
                        return "Jenis kerusakan wajib diisi";
                      }
                    }}
                  >
                    <Label>Kerusakan</Label>

                    <Input
                      placeholder="Jenis Kerusakan"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />

                    <div className="min-h-6">
                      {state.errors?.service?.[index] ? (
                        <ErrorMessage>
                          {state.errors.service[index]}
                        </ErrorMessage>
                      ) : (
                        <FieldError />
                      )}
                    </div>
                  </TextField>
                  <TextField
                    name={`servicePrice[${index}][price]`}
                    aria-label="Service Price"
                    type="text"
                    className="w-full"
                    value={item.price}
                    onChange={(value) => {
                      const numericValue = value.replace(/\D/g, "");

                      setServices((prev) =>
                        prev.map((service, i) =>
                          i === index
                            ? { ...service, price: numericValue }
                            : service,
                        ),
                      );
                    }}
                    validate={(value) => {
                      if (!value) {
                        return "Biaya wajib diisi";
                      }
                    }}
                  >
                    <Label>Biaya</Label>

                    <Input
                      placeholder="Biaya Servis"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />

                    <div className="min-h-6">
                      {state.errors?.servicePrice?.[index] ? (
                        <ErrorMessage>
                          {state.errors.servicePrice[index]}
                        </ErrorMessage>
                      ) : (
                        <FieldError />
                      )}
                    </div>
                  </TextField>
                  <div className="min-w-30 pt-6">
                    {services.length > 1 && (
                      <Button
                        type="button"
                        onPress={() => removeService(index)}
                        variant="danger"
                      >
                        <Trash />
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onPress={addService}
                variant="secondary"
                className="text-slate-800"
              >
                <Plus />
                Tambah Kerusakan
              </Button>
            </div>
          </div>
        </div>

        <div className="self-center flex flex-col items-center w-full">
          <div className="min-h-6">
            {state.errors?.general && (
              <ErrorMessage>{state.errors.general}</ErrorMessage>
            )}
          </div>
          <div className="self-end space-x-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/order?outletId=${selectedOutletId}`)}
              className="text-slate-800"
            >
              Kembali
            </Button>

            <Button
              type="submit"
              isDisabled={isPending}
              className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
            >
              {isPending ? "Memproses..." : "Simpan & Buat Nota"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
