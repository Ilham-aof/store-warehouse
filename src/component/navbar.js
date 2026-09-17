import { Link } from "@heroui/react";
import React from "react";

export function Navbar() {
  return (
    <nav className="grid grid-cols-3 items-center bg-amber-500 h-13 px-4">
      <h1 className="justify-self-start">Toko Saya</h1>

      <div className="flex justify-center gap-10">
        <Link href="/stock">Stock Barang</Link>
        <Link href="/nota">Cetak Nota</Link>
        <Link href="/riwayat-barang">Riwayat Barang</Link>
        <Link href="/riwayat-nota">Riwayat Nota</Link>
      </div>

      <div />
    </nav>
  );
}
