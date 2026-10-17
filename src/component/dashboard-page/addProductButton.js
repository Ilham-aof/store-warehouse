"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function AddProductButton({ selectedOutletId }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/add-product?outletId=${selectedOutletId}`)}
      className="border-2 border-slate-700 bg-white text-slate-700 hover:bg-slate-700 hover:text-white"
    >
      <Plus />
      Tambah Produk
    </Button>
  );
}
