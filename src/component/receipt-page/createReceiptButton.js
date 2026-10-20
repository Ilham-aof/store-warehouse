"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function CreateReceiptButton({ selectedOutletId }) {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        router.push(`/order/create-receipt?outletId=${selectedOutletId}`)
      }
      className="bg-slate-800 text-yellow-100 hover:bg-slate-600"
    >
      <Plus />
      Buat Nota Servis
    </Button>
  );
}
