"use client";

import {
  Button,
  Input,
  TextField,
  ErrorMessage,
  FieldError,
  Label,
  ListBox,
  Select,
  Separator,
  toast,
} from "@heroui/react";
import { Plus, Trash, FilePlus } from "lucide-react";
import { useState, useActionState } from "react";
import { createServiceReceipt } from "@/app/action/serviceReceipt/createServiceReceipt";
import { OutletSelection } from "@/component/outletSelection";
import { useRouter } from "next/navigation";

export function ReceiptForm({ outlets, selectedOutletId }) {
  const router = useRouter();
  const [discount, setDiscount] = useState("0");
  const [services, setServices] = useState([
    {
      description: "",
      price: "",
    },
  ]);

  const [cusPhone, setCusPhone] = useState("");
  const [selectedDeviceInclusions, setSelectedDeviceInclusions] = useState([
    "handphone",
  ]);
  const [showDeviceInclusionsError, setShowDeviceInclusionsError] =
    useState(false);

  const accessoryLabels = {
    handphone: "Handphone",
    simcard: "SIM Card",
    charger: "Charger",
    battery: "Battery",
    memory: "Memory",
    softcase: "Soft Case",
  };

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

  const totalService = services.reduce(
    (total, service) => total + (Number(service.price) || 0),
    0,
  );

  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await createServiceReceipt(prevState, formData);
      if (result.success) {
        toast.success("Nota servis berhasil dibuat");
        router.push(`/service?outletId=${selectedOutletId}`);
      } else if (result.errors?.general) {
        toast.danger("Gagal membuat nota servis", {
          description: result.errors.general,
        });
      } else {
        toast.danger("Periksa kembali data yang kamu masukkan");
      }
      return result;
    },
    {
      success: false,
      errors: null,
    },
  );

  return (
    <section className="bg-white flex flex-col rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 space-y-5">
      <div className="flex space-x-3 items-center">
        <FilePlus size={30} />
        <h1 className="text-2xl font-bold">Tambah Servis Baru</h1>
      </div>
      <form
        action={action}
        onSubmit={(event) => {
          if (selectedDeviceInclusions.length === 0) {
            event.preventDefault();
            setShowDeviceInclusionsError(true);
          }
        }}
        className="flex flex-col space-y-5"
      >
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
        <div className="grid grid-cols-[1.2fr_3fr] gap-5">
          <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 h-fit">
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-bold">Data Pelanggan</h2>
              <TextField
                name="customerName"
                aria-label="Customer Name"
                variant="secondary"
                type="text"
                validate={(value) => {
                  if (!value) {
                    return "Nama pelanggan wajib diisi.";
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
                variant="secondary"
                type="tel"
                value={cusPhone}
                onChange={(value) => setCusPhone(value.replace(/\D/g, ""))}
                validate={(value) => {
                  if (value && !/^08\d{8,11}$/.test(value)) {
                    return "Nomor HP tidak valid.";
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
                variant="secondary"
                type="text"
                validate={(value) => {
                  if (!value) {
                    return "Tipe HP wajib diisi.";
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

              <Select
                name="deviceInclusions"
                placeholder="Kelengkapan HP"
                selectionMode="multiple"
                variant="secondary"
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
                <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
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
                    <ListBox.Item
                      id="handphone"
                      textValue="Handphone"
                      className="ring-0 outline-none shadow-none ring-offset-0"
                    >
                      Handphone
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="simcard"
                      textValue="SIM Card"
                      className="ring-0 outline-none shadow-none ring-offset-0"
                    >
                      SIM Card
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="charger"
                      textValue="Charger"
                      className="ring-0 outline-none shadow-none ring-offset-0"
                    >
                      Charger
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="battery"
                      textValue="Battery"
                      className="ring-0 outline-none shadow-none ring-offset-0"
                    >
                      Battery
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="memory"
                      textValue="Memory"
                      className="ring-0 outline-none shadow-none ring-offset-0"
                    >
                      Memory
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item
                      id="softcase"
                      textValue="Soft Case"
                      className="ring-0 outline-none shadow-none ring-offset-0"
                    >
                      Soft Case
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                <div className="min-h-6">
                  {showDeviceInclusionsError &&
                    selectedDeviceInclusions.length === 0 && (
                      <FieldError>
                        Pilih minimal satu kelengkapan HP.
                      </FieldError>
                    )}
                </div>
              </Select>
            </div>
          </div>

          <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Data Servis</h2>
              {services.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_0.4fr_0.4fr_0.4fr] gap-5"
                >
                  <TextField
                    name={`phoneDamageType[${index}][description]`}
                    aria-label="Jenis Kerusakan"
                    variant="secondary"
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
                        return "Jenis kerusakan wajib diisi.";
                      }
                    }}
                  >
                    <Label>Kerusakan</Label>
                    <Input
                      placeholder="Jenis Kerusakan"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      {state.errors?.service?.[index]?.description ? (
                        <ErrorMessage>
                          {state.errors.service[index].description}
                        </ErrorMessage>
                      ) : (
                        <FieldError />
                      )}
                    </div>
                  </TextField>

                  <TextField
                    name={`servicePrice[${index}][price]`}
                    aria-label="Service Price"
                    variant="secondary"
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
                        return "Biaya wajib diisi.";
                      }
                    }}
                  >
                    <Label>Biaya</Label>
                    <Input
                      placeholder="Biaya Servis"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      {state.errors?.service?.[index]?.price ? (
                        <ErrorMessage>
                          {state.errors.service[index].price}
                        </ErrorMessage>
                      ) : (
                        <FieldError />
                      )}
                    </div>
                  </TextField>

                  <TextField
                    name={`serviceWarranty[${index}][warranty]`}
                    aria-label="Service Warranty"
                    variant="secondary"
                    type="number"
                    validate={(value) => {
                      if (!value) {
                        return "Garansi wajib diisi.";
                      }
                    }}
                  >
                    <Label>Garansi</Label>
                    <Input
                      placeholder="Masa Garansi (Hari)"
                      className="hover:bg-gray-200 focus:ring-slate-800"
                    />
                    <div className="min-h-6">
                      {state.errors?.service?.[index]?.warranty ? (
                        <ErrorMessage>
                          {state.errors.service[index].warranty}
                        </ErrorMessage>
                      ) : (
                        <FieldError />
                      )}
                    </div>
                  </TextField>
                  <div className="pt-6">
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
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalService)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_1fr_0.4fr] gap-5">
                <TextField
                  name="discount"
                  aria-label="Potongan Harga"
                  variant="secondary"
                  type="text"
                  value={discount}
                  onChange={(value) => {
                    setDiscount(value.replace(/\D/g, ""));
                  }}
                >
                  <Label>Potongan Harga (Rp)</Label>
                  <Input
                    placeholder="Masukkan potongan"
                    className="hover:bg-gray-200 focus:ring-slate-800"
                  />
                  <div className="min-h-6">
                    {state.errors?.discount ? (
                      <ErrorMessage>{state.errors.discount}</ErrorMessage>
                    ) : (
                      <FieldError />
                    )}
                  </div>
                </TextField>
              </div>
            </div>
          </div>
        </div>
        <div className="self-center flex flex-col items-center w-full">
          <div className="self-end space-x-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push(`/service?outletId=${selectedOutletId}`)
              }
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
    </section>
  );
}
