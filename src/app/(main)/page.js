import { getCurrentUser } from "@/app/action/getCurrentUser";
import { getDataProduct } from "@/app/action//product/getDataProduct";
import { LogoutButton } from "@/component/logoutButton";
import { Navbar } from "@/component/navbar";
import { AddProductButton } from "@/component/addProductButton";
import { ProductList } from "@/component/productList";

export default async function Home() {
  const user = await getCurrentUser();
  const products = await getDataProduct();

  return (
    <main>
      <section>
        <Navbar />
      </section>
      <div className="flex gap-4 p-4">
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
          <ProductList products={products} />
        </section>
      </div>
    </main>
  );
}
