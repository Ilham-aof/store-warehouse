"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function AddProductButton() {
  const router = useRouter();
  return (
    <>
      <Button onClick={() => router.push("/add-product")}>
        <Plus />
        Tambah Barang
      </Button>
    </>
  );
}
