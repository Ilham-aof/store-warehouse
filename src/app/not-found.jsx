import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="w-screen h-screen p-10 flex justify-center items-center bg-mauve-100">
      <div className="bg-white flex flex-col justify-center items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-13 w-xl h-fit text-center">
        <FileQuestion size={64} className="mb-6 text-default-400" />

        <h1 className="text-6xl font-bold">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">Halaman Tidak Ditemukan</h2>

        <p className="mt-2 max-w-md text-default-500">
          Maaf, halaman yang Anda cari tidak tersedia atau mungkin sudah
          dipindahkan.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-full bg-primary px-5 py-3 text-yellow-100 bg-slate-800 hover:bg-primary/80"
        >
          Kembali ke Menu Utama
        </Link>
      </div>
    </main>
  );
}
