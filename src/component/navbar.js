"use client";
import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import React from "react";

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="grid grid-cols-[1fr_auto_1fr] items-center bg-amber-500 h-13 px-4">
      <h1 className="justify-self-start">Toko Saya</h1>

      <div className="flex justify-center gap-10">
        <Link
          className={`no-underline font-bold p-2  ${
            pathname === "/" ? "" : ""
          }`}
          href="/"
        >
          Stock Barang
        </Link>
        <Link className="no-underline font-bold p-2" href="/nota">
          Cetak Nota
        </Link>
        <Link className="no-underline font-bold p-2" href="/riwayat-barang">
          Riwayat Barang
        </Link>
        <Link className="no-underline font-bold p-2" href="/riwayat-nota">
          Riwayat Nota
        </Link>
      </div>

      <div />
    </nav>
  );
}
