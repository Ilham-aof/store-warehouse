import { getCurrentUser } from "@/app/action/auth/getCurrentUser";
import { LogoutButton } from "@/component/logoutButton";
import { Navbar } from "@/component/navbar";

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
            <p>Nama : {user.name}</p>
            <p>Posisi : {user.role}</p>
          </div>
          <LogoutButton />
        </section>
        <section className="border-2 rounded-2xl border-amber-500 p-4 w-screen">
          <h1>Barang</h1>
        </section>
      </div>
    </main>
  );
}
