"use client";

import { Button } from "@heroui/react";
import { UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function RegisterButton() {
  const router = useRouter();

  return (
    <>
      <Button
        type="button"
        className="border-yellow-100 bg-slate-800 text-yellow-100"
        onClick={() => router.push("/register")}
      >
        <UserRoundPlus />
        Tambah staff baru
      </Button>
    </>
  );
}
