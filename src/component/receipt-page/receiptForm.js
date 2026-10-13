"use client";

import {
  Button,
  Input,
  TextField,
  ErrorMessage,
  FieldError,
  Label,
} from "@heroui/react";
import { Plus, Trash, ReceiptText } from "lucide-react";
import { useState, useActionState } from "react";
import { createServiceReceipt } from "@/app/action/serviceReceipt/createServiceReceipt";
import { OutletSelection } from "@/component/outletSelection";

export function ReceiptForm({ outlets, selectedOutletId }) {
  const [services, setServices] = useState([
    {
      description: "",
      price: "",
    },
  ]);

  const [warranty, setWarranty] = useState("");
  const [cusPhone, setCusPhone] = useState("");
  const [price, setPrice] = useState("");

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
    <div className="flex flex-col items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 space-y-5">
      <div className="flex space-x-3 items-center">
        <ReceiptText size={30} />
        <h1 className="text-2xl font-bold">Buat Nota</h1>
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

        <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-5 space-y-5">
          <h2 className="text-xl font-bold">Data Customer</h2>
          <div className="grid grid-cols-2 gap-3">
            <TextField
              name="customerName"
              aria-label="Customer Name"
              type="text"
              className="w-64"
              validate={(value) => {
                if (!value) {
                  return "Nama customer wajib diisi";
                }
              }}
            >
              <Label>Nama Customer</Label>

              <Input
                placeholder="Nama Customer"
                className="hover:bg-gray-200"
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
              type="text"
              className="w-64"
              value={cusPhone}
              onChange={(value) => setCusPhone(value.replace(/\D/g, ""))}
              validate={(value) => {
                if (!value) {
                  return "Nomor customer wajib diisi";
                }
                if (!/^08\d{8,11}$/.test(value)) {
                  return "Nomor HP tidak valid";
                }
              }}
            >
              <Label>Nomor Customer</Label>
              <Input
                placeholder="Nomor Customer"
                className="hover:bg-gray-200"
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
              aria-label="Customer Device"
              type="text"
              className="w-64"
              validate={(value) => {
                if (!value) {
                  return "Device Custome wajib diisi";
                }
              }}
            >
              <Label>Device</Label>
              <Input
                placeholder="Device Customer"
                className="hover:bg-gray-200"
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
              type="text"
              className="w-64"
              value={warranty}
              onChange={(value) => setWarranty(value.replace(/\D/g, ""))}
              validate={(value) => {
                if (!value) {
                  return "Garansi wajib diisi";
                }
              }}
            >
              <Label>Garansi</Label>
              <Input
                placeholder="Waktu Garansi (hari)"
                className="hover:bg-gray-200"
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
        <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-5 space-y-5">
          <h2 className="text-xl font-bold">Data Servis</h2>
          <div className="space-y-4">
            {services.map((item, index) => (
              <div key={index} className="flex items-start space-x-5">
                <TextField
                  name={`phoneDamageType[${index}][description]`}
                  aria-label="Jenis Kerusakan"
                  type="text"
                  className="w-64"
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
                  <Label>Jenis Kerusakan</Label>

                  <Input
                    placeholder="Jenis Kerusakan"
                    className="hover:bg-gray-200"
                  />

                  <div className="min-h-6">
                    {state.errors?.service?.[index] ? (
                      <ErrorMessage>{state.errors.service[index]}</ErrorMessage>
                    ) : (
                      <FieldError />
                    )}
                  </div>
                </TextField>
                <TextField
                  name={`servicePrice[${index}][price]`}
                  aria-label="Service Price"
                  type="text"
                  className="w-64"
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
                    className="hover:bg-gray-200"
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
            <Button type="button" onPress={addService} variant="secondary">
              <Plus />
              Tambah Kerusakan
            </Button>
          </div>
        </div>
        <div className="self-center">
          <div className="min-h-6">
            {state.errors?.general && (
              <ErrorMessage>{state.errors.general}</ErrorMessage>
            )}
          </div>

          <Button type="submit" isDisabled={isPending}>
            {isPending ? "Memproses..." : "Buat Nota"}
          </Button>
        </div>
      </form>
    </div>
  );
}
