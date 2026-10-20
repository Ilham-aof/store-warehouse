"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function AddProductButton({ selectedOutletId }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/add-product?outletId=${selectedOutletId}`)}
      className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
    >
      <Plus />
      Tambah Produk
    </Button>
  );
}
