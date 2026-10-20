"use client";

import {
  Button,
  Input,
  Label,
  TextField,
  ErrorMessage,
  FieldError,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useState, useActionState } from "react";
import { addProductAction } from "@/app/action/product/addProduct";
import { OutletSelection } from "@/component/outletSelection";
import { useRouter } from "next/navigation";

export function AddProductForm({ outlets, selectedOutletId }) {
  const router = useRouter();
  const [forms, setForms] = useState([0]);
  const [nextFormId, setNextFormId] = useState(1);
  const [quantity, setQuantity] = useState({});
  const [price, setPrice] = useState({});

  const [state, action, isPending] = useActionState(addProductAction, {
    success: false,
    errors: {},
  });

  return (
    <div className="bg-white  items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 space-y-5">
      <div className="flex space-x-3 items-center">
        <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
      </div>

      <form action={action} className="flex flex-col space-y-5">
        <OutletSelection
          outlets={outlets}
          selectedOutletId={selectedOutletId}
        />
        <input
          type="hidden"
          name="outletId"
          value={selectedOutletId ?? ""}
          readOnly
        />
        {forms.map((formId, index) => (
          <div
            key={formId}
            className="rounded-xl shadow-[4px_4px_4px,inset_0_0_4px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 space-y-5"
          >
            <h2 className="text-xl font-bold">Detail Produk</h2>
            <div className="grid grid-cols-3 gap-x-5 gap-y-3">
              <TextField
                name={`products[${index}][barcode]`}
                aria-label="product Barcode"
                type="text"
                className="w-full"
                validate={(value) => {
                  if (!value) {
                    return "Barcode produk wajib diisi";
                  }
                }}
              >
                <Label>Barcode</Label>

                <Input
                  placeholder="Barcode Produk"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.[index]?.barcode ? (
                    <ErrorMessage>{state.errors[index].barcode}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name={`products[${index}][name]`}
                aria-label="product Name"
                type="text"
                className="w-full"
                validate={(value) => {
                  if (!value) {
                    return "Nama produk wajib diisi";
                  }
                }}
              >
                <Label>Nama</Label>

                <Input
                  placeholder="Nama Produk"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.[index]?.name ? (
                    <ErrorMessage>{state.errors[index].name}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name={`products[${index}][category]`}
                aria-label="product category"
                type="text"
                className="w-full"
                validate={(value) => {
                  if (!value) {
                    return "Kategori produk wajib diisi";
                  }
                }}
              >
                <Label>Kategori</Label>

                <Input
                  placeholder="Kategori Produk"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.[index]?.type ? (
                    <ErrorMessage>{state.errors[index].type}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name={`products[${index}][brand]`}
                aria-label="product Brand"
                type="text"
                className="w-full"
                validate={(value) => {
                  if (!value) {
                    return "Brand produk wajib diisi";
                  }
                }}
              >
                <Label>Brand</Label>

                <Input
                  placeholder="Brand Produk"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.[index]?.brand ? (
                    <ErrorMessage>{state.errors[index].brand}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name={`products[${index}][quantity]`}
                aria-label="product Quantity"
                type="number"
                className="w-full"
                value={quantity[formId] ?? ""}
                onChange={(value) => {
                  setQuantity((prev) => ({
                    ...prev,
                    [formId]: value.replace(/\D/g, ""),
                  }));
                }}
                validate={(value) => {
                  if (!value) {
                    return "Jumlah produk wajib diisi";
                  }
                }}
              >
                <Label>Jumlah</Label>

                <Input
                  placeholder="Jumlah Produk"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.[index]?.quantity ? (
                    <ErrorMessage>{state.errors[index].quantity}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
              <TextField
                name={`products[${index}][price]`}
                aria-label="product Price"
                type="text"
                className="w-full"
                value={price[formId] ?? ""}
                onChange={(value) => {
                  setPrice((prev) => ({
                    ...prev,
                    [formId]: value.replace(/\D/g, ""),
                  }));
                }}
                validate={(value) => {
                  if (!value) {
                    return "Harga produk wajib diisi";
                  }
                }}
              >
                <Label>Harga</Label>

                <Input
                  placeholder="Harga Produk"
                  className="hover:bg-gray-200 focus:ring-slate-800"
                />

                <div className="min-h-6">
                  {state.errors?.[index]?.price ? (
                    <ErrorMessage>{state.errors[index].price}</ErrorMessage>
                  ) : (
                    <FieldError />
                  )}
                </div>
              </TextField>
            </div>
            {forms.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="danger"
                  onPress={() => {
                    setForms((prev) => prev.filter((id) => id !== formId));
                  }}
                >
                  Hapus Form
                </Button>
              </div>
            )}
          </div>
        ))}

        <div>
          <Button
            type="button"
            variant="secondary"
            onPress={() => {
              setForms((prev) => [...prev, nextFormId]);
              setNextFormId((prev) => prev + 1);
            }}
            className="text-slate-800"
          >
            <Plus />
            Tambah Form
          </Button>
        </div>

        <div className="text-center">
          {state.errors?.general && (
            <ErrorMessage>{state.errors.general}</ErrorMessage>
          )}
        </div>

        <div className="self-end space-x-5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/?outletId=${selectedOutletId}`)}
            className="text-slate-800"
          >
            Kembali
          </Button>

          <Button
            type="submit"
            isDisabled={isPending}
            className="self-center bg-slate-800 text-yellow-100 hover:bg-slate-600"
          >
            {isPending ? "Menambahkan Produk..." : "Tambahkan Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
}
