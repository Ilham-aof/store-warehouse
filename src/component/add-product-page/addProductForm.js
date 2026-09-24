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

export function AddProductForm({ outlets }) {
  const [formCount, setFormCount] = useState(1);
  const [quantity, setQuantity] = useState({});
  const [price, setPrice] = useState({});
  const [selectedOutletId, setSelectedOutletId] = useState(
    outlets[0]?.id ?? null,
  );

  const [state, action, isPending] = useActionState(addProductAction, {
    success: false,
    errors: {},
  });

  return (
    <div className="flex flex-col items-center border-2 border-amber-400 p-4 space-y-3">
      <h1>Tambah Produk</h1>

      <form action={action} className="flex flex-col items-center space-y-3">
        <OutletSelection
          outlets={outlets}
          selectedOutletId={selectedOutletId}
          onOutletChange={setSelectedOutletId}
        />

        {Array.from({ length: formCount }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-xl border-2 border-black p-3"
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

        <div className="self-start">
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

        <Button type="submit" isDisabled={isPending}>
          {isPending ? "Menambahkan Produk..." : "Tambahkan Produk"}
        </Button>
      </form>
    </div>
  );
}
