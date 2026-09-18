import { getCurrentUser } from "@/app/action/getCurrentUser";
import { LogoutButton } from "@/component/logoutButton";
import { Navbar } from "@/component/navbar";
import { AddProductButton } from "@/component/addProductButton";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main>
      <section>
        <Navbar />
      </section>
      <div className="flex p-4 space-x-4">
        <section className="border-2 rounded-2xl border-amber-500 p-4 w-100 space-y-3">
          <h1 className="text-2xl font-bold">Informasi Akun</h1>
          <div>
            <p>Nama : {user?.name ?? "None"}</p>
            <p>Posisi : {user?.role ?? "None"}</p>
          </div>
          <LogoutButton />
        </section>
        <section className="border-2 rounded-2xl border-amber-500 p-4 w-screen">
          <h1>Stock Barang</h1>
          <AddProductButton />
        </section>
      </div>
    </main>
  );
}
