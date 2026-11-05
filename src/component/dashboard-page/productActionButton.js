"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Plus, PackagePlus, PackageMinus } from "lucide-react";

export function ProductActionButton({ selectedOutletId }) {
  const router = useRouter();

  return (
    <div className="space-x-5">
      <Button
        onClick={() => router.push(`/add-product?outletId=${selectedOutletId}`)}
        className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
      >
        <Plus />
        Produk Baru
      </Button>
      <Button
        onClick={() =>
          router.push(`/add-product-stock?outletId=${selectedOutletId}`)
        }
        className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
      >
        <PackagePlus />
        Tambah Stok
      </Button>
      <Button
        onClick={() =>
          router.push(`/take-product-stock?outletId=${selectedOutletId}`)
        }
        className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
      >
        <PackageMinus />
        Ambil Stok
      </Button>
    </div>
  );
}
