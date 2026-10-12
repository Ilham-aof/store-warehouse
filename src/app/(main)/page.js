import { getDataProduct } from "@/app/action//product/getDataProduct";
import { getBestSeller } from "@/app/action//product/getBestSeller";

import { StockBarang } from "@/component/dashboard-page/stockBarang";
import { getOutlet } from "@/app/action/outlet/getOutlet";

export default async function Home({ searchParams }) {
  const params = await searchParams;

  const outlets = await getOutlet();

  const outletId = params.outletId ?? outlets[0]?.id ?? null;

  const products = await getDataProduct(outletId);
  const bestSellers = await getBestSeller(outletId);
  return (
    <main className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-full space-y-5">
      <StockBarang
        outlets={outlets}
        products={products}
        selectedOutletId={outletId}
        bestSellers={bestSellers}
      />
    </main>
  );
}
