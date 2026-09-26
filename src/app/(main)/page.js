import { getCurrentUser } from "@/app/action/getCurrentUser";
import { getDataProduct } from "@/app/action//product/getDataProduct";
import { LogoutButton } from "@/component/logoutButton";
import { StockBarang } from "@/component/dashboard-page/stockBarang";
import { getOutlet } from "@/app/action/outlet/getOutlet";

export default async function Home() {
  const user = await getCurrentUser();
  const products = await getDataProduct();
  const outlets = await getOutlet();

  return (
    <main className="flex gap-4 w-full">
      <section className=" rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-70 h-fit space-y-3">
        <h1 className="text-2xl font-bold">Informasi Akun</h1>
        <div>
          <p>Nama : {user?.name ?? "None"}</p>
          <p>Posisi : {user?.role ?? "None"}</p>
        </div>
        <LogoutButton />
      </section>
      <StockBarang outlets={outlets} products={products} />
    </main>
  );
}
