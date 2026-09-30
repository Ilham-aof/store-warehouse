import { getCurrentUser } from "@/app/action/user/getCurrentUser";
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
    <main>
      <StockBarang
        outlets={outlets}
        products={products}
        selectedOutletId={outletId}
        bestSellers={bestSellers}
      />
    </main>
  );
}
