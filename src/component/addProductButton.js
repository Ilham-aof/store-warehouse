"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export function AddProductButton() {
  const router = useRouter();
  return (
    <main>
      <Button onClick={() => router.push("/add-product")}>Tambah Barang</Button>
    </main>
  );
}
