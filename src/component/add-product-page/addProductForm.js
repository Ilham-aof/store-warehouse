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
import { useState, useActionState, useEffect } from "react";
import { addProductAction } from "@/app/action/product/addProduct";
import { OutletSelection } from "@/component/outletSelection";

export function AddProductForm({ outlets }) {
  const [formCount, setFormCount] = useState(1);
  const [quantity, setQuantity] = useState({});
  const [price, setPrice] = useState({});
  const [selectedOutletId, setSelectedOutletId] = useState(
    outlets[0]?.id ?? null,
  );

  useEffect(() => {
    const savedOutletId = localStorage.getItem("selectedOutletId");

    if (savedOutletId) {
      setSelectedOutletId(savedOutletId);
    }
  }, []);

  const handleOutletChange = (outletId) => {
    setSelectedOutletId(outletId);
    localStorage.setItem("selectedOutletId", outletId);
  };

  const [state, action, isPending] = useActionState(addProductAction, {
    success: false,
    errors: {},
  });

  return (
    <div className="flex flex-col items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 space-y-3">
      <h1 className="text-2xl font-bold">Tambah Produk</h1>

      <form action={action} className="flex flex-col space-y-3">
        <OutletSelection
          outlets={outlets}
          selectedOutletId={selectedOutletId}
          onOutletChange={handleOutletChange}
        />

        {Array.from({ length: formCount }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-xl shadow-[4px_4px_4px,inset_0_0_4px_rgba(0,0,0,0.2)] shadow-gray-400 p-4"
          >
            <TextField
              name={`products[${index}][name]`}
              aria-label="productName"
              type="text"
              className="w-full max-w-64"
              validate={(value) => {
                if (!value) {
                  return "Nama produk wajib diisi";
                }
              }}
            >
              <Label>Nama Produk</Label>

              <Input placeholder="Nama Produk" className="hover:bg-gray-200" />

              <div className="min-h-6">
                {state.errors?.[index]?.name ? (
                  <ErrorMessage>{state.errors[index].name}</ErrorMessage>
                ) : (
                  <FieldError />
                )}
              </div>
            </TextField>

            <TextField
              name={`products[${index}][type]`}
              aria-label="productType"
              type="text"
              className="w-full max-w-64"
              validate={(value) => {
                if (!value) {
                  return "Tipe produk wajib diisi";
                }
              }}
            >
              <Label>Tipe</Label>

              <Input placeholder="Tipe Produk" className="hover:bg-gray-200" />

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
              aria-label="productBrand"
              type="text"
              className="w-full max-w-64"
              validate={(value) => {
                if (!value) {
                  return "Brand produk wajib diisi";
                }
              }}
            >
              <Label>Brand</Label>

              <Input placeholder="Brand Produk" className="hover:bg-gray-200" />

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
              aria-label="productQuantity"
              type="tel"
              className="w-full max-w-64"
              value={quantity[index] ?? ""}
              onChange={(value) => {
                setQuantity((prev) => ({
                  ...prev,
                  [index]: value.replace(/\D/g, ""),
                }));
              }}
              validate={(value) => {
                if (!value) {
                  return "Jumlah produk wajib diisi";
                }
              }}
            >
              <Label>Jumlah Produk</Label>

              <Input
                placeholder="Jumlah Produk"
                className="hover:bg-gray-200"
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
              aria-label="productPrice"
              type="tel"
              className="w-full max-w-64"
              value={price[index] ?? ""}
              onChange={(value) => {
                setPrice((prev) => ({
                  ...prev,
                  [index]: value.replace(/\D/g, ""),
                }));
              }}
              validate={(value) => {
                if (!value) {
                  return "Harga produk wajib diisi";
                }
              }}
            >
              <Label>Harga</Label>

              <Input placeholder="Harga Produk" className="hover:bg-gray-200" />

              <div className="min-h-6">
                {state.errors?.[index]?.price ? (
                  <ErrorMessage>{state.errors[index].price}</ErrorMessage>
                ) : (
                  <FieldError />
                )}
              </div>
            </TextField>
          </div>
        ))}

        <div>
          <Button
            type="button"
            variant="secondary"
            onPress={() => setFormCount((prev) => prev + 1)}
          >
            <Plus />
            Tambah Form
          </Button>
        </div>

        <div className="min-h-6">
          {state.errors?.general && (
            <ErrorMessage>{state.errors.general}</ErrorMessage>
          )}
        </div>

        <Button type="submit" isDisabled={isPending} className="self-center">
          {isPending ? "Menambahkan Produk..." : "Tambahkan Produk"}
        </Button>
      </form>
    </div>
  );
}
